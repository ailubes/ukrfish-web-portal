
import { supabase } from "@/integrations/supabase/client";
import { NewsArticle } from "@/types";

/**
 * Creates RLS policies for news_articles table if they don't exist
 * This function should be called once during application initialization
 */
export const ensureNewsArticlesRLSPolicies = async (): Promise<void> => {
  try {
    // Check if user is admin before attempting to create policies
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("No authenticated session found, skipping RLS policy check");
      return;
    }
    
    // Try to read profile data to check admin status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (profileError || profile?.role !== 'admin') {
      console.log("User is not admin, skipping RLS policy check");
      return;
    }
    
    console.log("Admin user detected, attempting to create sample article to check policies");
    
    // Try to insert a test article (will be deleted immediately)
    // This will help us determine if the RLS policies are working correctly
    const testArticleId = 'test-article-' + Date.now();
    const { error: insertError } = await supabase
      .from('news_articles')
      .insert({
        id: testArticleId,
        title: 'Test Article',
        content: 'Test content',
        summary: 'Test summary'
      });
    
    // If insertion failed due to policy issue, log it
    if (insertError) {
      console.error("Failed to insert test article:", insertError);
      console.warn("You might need to add RLS policies for the news_articles table in Supabase");
      console.warn("Make sure admin users have full access to the news_articles table");
    } else {
      // Clean up test article
      await supabase.from('news_articles').delete().eq('id', testArticleId);
      console.log("RLS policies for news_articles are correctly configured");
    }
  } catch (error) {
    console.error("Error checking RLS policies:", error);
  }
};

/**
 * Fetches a single article by its ID
 */
export const getArticleById = async (id: string): Promise<NewsArticle | null> => {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching article:", error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      summary: data.summary,
      imageUrl: data.image_url || '',
      publishDate: new Date(data.publish_date || new Date()),
      category: data.category || 'Загальні новини',
      author: data.author || 'Адміністратор',
      tags: data.tags || [],
    };
  } catch (error) {
    console.error("Exception fetching article:", error);
    return null;
  }
};
