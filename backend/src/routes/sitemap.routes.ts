import { Router, Request, Response } from 'express';
import { db, prompts } from '../db/index.js';
import { eq } from 'drizzle-orm';

const router = Router();

/**
 * 生成动态 sitemap.xml
 * GET /sitemap.xml
 */
router.get('/sitemap.xml', async (_req: Request, res: Response) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://promptvalar.com';
    
    // 获取所有已发布的提示词
    const publishedPrompts = await db
      .select({
        id: prompts.id,
        updatedAt: prompts.updatedAt,
      })
      .from(prompts)
      .where(eq(prompts.isPublished, true))
      .limit(1000); // 限制数量以避免过大的 sitemap

    // 生成 sitemap XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 首页 -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 提示词库 -->
  <url>
    <loc>${baseUrl}/library</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- 定价页 -->
  <url>
    <loc>${baseUrl}/pricing</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- 提示词详情页 -->
  ${publishedPrompts.map(prompt => `
  <url>
    <loc>${baseUrl}/library/${prompt.id}</loc>
    <lastmod>${prompt.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('生成 sitemap 失败:', error);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;

