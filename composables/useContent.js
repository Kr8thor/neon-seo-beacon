export const useContent = () => {
  // Get featured SEO tips
  const getFeaturedTips = async (limit = 3) => {
    return await queryContent('/seo-tips')
      .where({ featured: true })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .find()
  }

  // Search content across all sections
  const searchContent = async (query, sections = []) => {
    const searchQuery = queryContent()
    
    if (sections.length > 0) {
      searchQuery.where({ _path: { $in: sections.map(section => `/${section}`) } })
    }
    
    return await searchQuery
      .where({
        $or: [
          { title: { $icontains: query } },
          { description: { $icontains: query } },
          { tags: { $contains: query } }
        ]
      })
      .find()
  }

  // Get related content based on tags
  const getRelatedContent = async (currentPath, tags = [], limit = 3) => {
    if (!tags.length) return []
    
    return await queryContent()
      .where({
        _path: { $ne: currentPath },
        tags: { $in: tags }
      })
      .limit(limit)
      .find()
  }

  // Get content by category
  const getContentByCategory = async (category, limit = 10) => {
    return await queryContent()
      .where({ category })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .find()
  }

  // Get popular content (by view count or featured status)
  const getPopularContent = async (limit = 5) => {
    return await queryContent()
      .where({ featured: true })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .find()
  }

  // Get content navigation for a section
  const getContentNavigation = async (section) => {
    return await queryContent(`/${section}`)
      .only(['_path', 'title', 'description', 'category'])
      .sort({ _path: 1 })
      .find()
  }

  // Get all tags with their usage count
  const getAllTags = async () => {
    const content = await queryContent()
      .only(['tags'])
      .find()
    
    const tagCount = {}
    
    content.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    })
    
    return Object.entries(tagCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
  }

  // Get all categories with their content count
  const getAllCategories = async () => {
    const content = await queryContent()
      .only(['category'])
      .find()
    
    const categoryCount = {}
    
    content.forEach(item => {
      if (item.category) {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
      }
    })
    
    return Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
  }

  // Get content sitemap data
  const getSitemapData = async () => {
    return await queryContent()
      .only(['_path', 'title', 'description', 'updatedAt', 'publishedAt'])
      .where({ _draft: { $ne: true } })
      .find()
  }

  // Get recent content
  const getRecentContent = async (limit = 10) => {
    return await queryContent()
      .sort({ publishedAt: -1 })
      .limit(limit)
      .find()
  }

  return {
    getFeaturedTips,
    searchContent,
    getRelatedContent,
    getContentByCategory,
    getPopularContent,
    getContentNavigation,
    getAllTags,
    getAllCategories,
    getSitemapData,
    getRecentContent
  }
}