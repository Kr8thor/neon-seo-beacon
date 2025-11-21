# Phase 2.1: Dashboard Page Rebuild

## Context
Completely rebuild `pages/dashboard.vue` using Phase 1 components and stores to create a production-grade dashboard.

## Prerequisites
- Phase 1.1: Design tokens ✅
- Phase 1.2: Widget system ✅
- Phase 1.3: Chart components ✅
- Phase 1.4: Pinia stores ✅

## Deliverables

### 1. Rewrite `pages/dashboard.vue`
```vue
<template>
  <div class="dashboard-page min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <!-- Sticky Header -->
    <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Last updated {{ formatRelativeTime(dashboardStore.lastRefresh) }}
            </p>
          </div>

          <!-- Toolbar Actions -->
          <div class="flex items-center gap-4">
            <!-- Search -->
            <SearchInput 
              v-model="filterStore.global.search"
              placeholder="Search audits..."
              @focus="showSearchResults = true"
            />

            <!-- Filter Dropdown -->
            <FilterDropdown 
              :status="auditStore.filter.status"
              :severity="auditStore.filter.severity"
              @status-change="auditStore.setStatusFilter"
              @severity-change="auditStore.setSeverityFilter"
            />

            <!-- Refresh Button -->
            <button
              @click="refreshDashboard"
              :disabled="auditStore.loading"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" :class="{ 'animate-spin': auditStore.loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <!-- Export -->
            <ExportDropdown />

            <!-- Layout Presets -->
            <LayoutPresetMenu />
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- KPI Cards Row (4-up) -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Avg SEO Score"
          :value="auditStore.statistics.avgScore"
          unit="/100"
          trend="+4"
          icon="chart"
        />
        <KPICard
          title="Total Audits"
          :value="auditStore.statistics.total"
          trend="This month"
          icon="document"
        />
        <KPICard
          title="Critical Issues"
          :value="auditStore.statistics.critical"
          severity="critical"
          icon="alert"
        />
        <KPICard
          title="Completed"
          :value="auditStore.statistics.completed"
          :total="auditStore.statistics.total"
          icon="check"
        />
      </section>

      <!-- Widget Grid (Drag-to-reorder) -->
      <section class="grid grid-cols-12 gap-4 auto-rows-max mb-8">
        <div
          v-for="widget in dashboardStore.visibleWidgets"
          :key="widget.id"
          draggable
          @dragstart="onDragStart(widget.id)"
          @dragend="onDragEnd"
          @dragover.prevent
          @drop="onDrop(widget.id)"
          class="transition-all duration-200"
          :class="[`col-span-${widget.sizeX} row-span-${widget.sizeY}`, { 'opacity-50': draggingId === widget.id }]"
        >
          <DashboardWidget :widget="widget" @remove="dashboardStore.removeWidget(widget.id)">
            <component :is="getWidgetComponent(widget.type)" :widget-id="widget.id" />
          </DashboardWidget>
        </div>
      </section>

      <!-- Recent Audits Table -->
      <section class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Recent Audits</h2>
          <button 
            @click="$router.push('/new-audit')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Audit
          </button>
        </div>

        <VirtualizedDataTable
          :data="auditStore.filteredAudits"
          :columns="auditTableColumns"
          @row-click="viewAudit"
        />
      </section>

      <!-- Critical Issues Widget -->
      <section v-if="auditStore.criticalIssues.length > 0" class="mb-8">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Critical Issues</h2>
        <div class="space-y-2">
          <div
            v-for="issue in auditStore.criticalIssues"
            :key="issue.id"
            class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            @click="viewAudit"
          >
            <p class="font-semibold text-red-900 dark:text-red-100">{{ issue.title }}</p>
            <p class="text-sm text-red-700 dark:text-red-300">{{ issue.description }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

const router = useRouter();
const auditStore = useAuditStore();
const dashboardStore = useDashboardStore();
const filterStore = useFilterStore();

// State
const draggingId = ref<string | null>(null);
const showSearchResults = ref(false);

// Audit table columns
const auditTableColumns = [
  { key: 'score', label: 'Score', width: 100, sortable: true },
  { key: 'url', label: 'Website', width: 300, sortable: true },
  { key: 'status', label: 'Status', width: 120, sortable: true },
  { key: 'findings', label: 'Issues', width: 80, sortable: true },
  { key: 'createdAt', label: 'Created', width: 150, sortable: true },
];

// Methods
async function refreshDashboard() {
  await auditStore.fetchAudits(true);
  dashboardStore.triggerRefresh();
}

function onDragStart(id: string) {
  draggingId.value = id;
}

function onDragEnd() {
  draggingId.value = null;
}

function onDrop(targetId: string) {
  if (draggingId.value && draggingId.value !== targetId) {
    // Swap positions
    const sourceIdx = dashboardStore.widgets.findIndex(w => w.id === draggingId.value);
    const targetIdx = dashboardStore.widgets.findIndex(w => w.id === targetId);
    
    if (sourceIdx >= 0 && targetIdx >= 0) {
      [dashboardStore.widgets[sourceIdx], dashboardStore.widgets[targetIdx]] = 
      [dashboardStore.widgets[targetIdx], dashboardStore.widgets[sourceIdx]];
    }
  }
  draggingId.value = null;
}

function getWidgetComponent(type: string) {
  const components: Record<string, any> = {
    'recent-audits': RecentAuditsWidget,
    'score-trend': ScoreTrendWidget,
    'critical-issues': CriticalIssuesWidget,
    'performance-metrics': PerformanceMetricsWidget,
  };
  return components[type] || null;
}

function viewAudit(auditId: string) {
  router.push(`/audits/${auditId}`);
}

function formatRelativeTime(timestamp: number): string {
  const ms = Date.now() - timestamp;
  if (ms < 60000) return 'Just now';
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ago`;
  if (ms < 86400000) return `${Math.floor(ms / 3600000)}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

// Lifecycle
onMounted(() => {
  auditStore.fetchAudits();
  dashboardStore.loadLayout(dashboardStore.currentLayout);
});

// Keyboard shortcuts
useKeyboardShortcuts({
  'Ctrl+K': () => document.querySelector('input[type="search"]')?.focus(),
  'Ctrl+N': () => router.push('/new-audit'),
  'Ctrl+R': () => refreshDashboard(),
});

// SEO
useSEO({
  title: 'Dashboard | Neon SEO Beacon',
  description: 'Monitor your SEO audits, track performance, and manage website optimization.',
});
</script>
```

## Components to Create
- `components/KPICard.vue` - Single KPI display
- `components/SearchInput.vue` - Search box
- `components/FilterDropdown.vue` - Filter UI
- `components/ExportDropdown.vue` - Export options
- `components/LayoutPresetMenu.vue` - Layout switching

## Widgets to Create
- `components/widgets/RecentAuditsWidget.vue`
- `components/widgets/ScoreTrendWidget.vue`
- `components/widgets/CriticalIssuesWidget.vue`
- `components/widgets/PerformanceMetricsWidget.vue`

## Acceptance Criteria
- ✅ Page loads without errors
- ✅ KPI cards display correct data from store
- ✅ Widgets render and are drag-to-reorder
- ✅ Filters update table in real-time
- ✅ Responsive on mobile/tablet/desktop
- ✅ Keyboard shortcuts work
- ✅ Performance: FCP < 2s, LCP < 3s