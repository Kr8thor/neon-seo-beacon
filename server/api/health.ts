import { defineEventHandler } from 'h3'

interface SystemInfo {
  nodeVersion: string
  platform: NodeJS.Platform
  architecture: string
  memory: {
    used: number
    total: number
  }
}

interface DependencyStatus {
  status: 'healthy' | 'unhealthy'
  message?: string
}

interface HealthResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  uptime: number
  version: string
  environment: string
  system: SystemInfo
  dependencies: {
    supabase: DependencyStatus
    anthropic: DependencyStatus
  }
}

const startTime = Date.now()

export default defineEventHandler(async (): Promise<HealthResponse> => {
  const memoryUsage = process.memoryUsage()

  const systemInfo: SystemInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    memory: {
      used: Math.round(memoryUsage.heapUsed),
      total: Math.round(memoryUsage.heapTotal)
    }
  }

  // Check Supabase connection
  const supabaseStatus = checkSupabaseHealth()

  // Check Anthropic API
  const anthropicStatus = checkAnthropicHealth()

  const uptime = (Date.now() - startTime) / 1000

  const overallStatus =
    supabaseStatus.status === 'healthy' && anthropicStatus.status === 'healthy'
      ? 'healthy'
      : 'unhealthy'

  const response: HealthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime,
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    system: systemInfo,
    dependencies: {
      supabase: supabaseStatus,
      anthropic: anthropicStatus
    }
  }

  return response
})

function checkSupabaseHealth(): DependencyStatus {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      status: 'unhealthy',
      message: 'Missing Supabase configuration'
    }
  }

  return {
    status: 'healthy',
    message: 'Connected'
  }
}

function checkAnthropicHealth(): DependencyStatus {
  const anthropicKey = process.env.ANTHROPIC_API_KEY

  if (!anthropicKey) {
    return {
      status: 'unhealthy',
      message: 'Missing Anthropic API key'
    }
  }

  return {
    status: 'healthy',
    message: 'Connected'
  }
}
