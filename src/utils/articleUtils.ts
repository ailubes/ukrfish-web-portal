
import { supabase } from "@/integrations/supabase/client";
import { NewsArticle } from "@/types";

/**
 * Tests access to the news_articles table with a simple read operation
 * This is safer than trying to insert/delete test articles
 */
export const ensureNewsArticlesRLSPolicies = async (): Promise<void> => {
  try {
    // Check if user is admin before attempting to test access
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log("No authenticated session found, skipping access check");
      return;
    }
    
    // Try to read profile data to check admin status - ONLY use profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (profileError || profile?.role !== 'admin') {
      console.log("User is not admin, skipping access check");
      return;
    }
    
    console.log("Admin user detected, checking news_articles table access");
    
    // Simply try to read from the table instead of inserting test records
    const { data, error } = await supabase
      .from('news_articles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error("Failed to read from news_articles table:", error);
      console.warn("You might need to add RLS policies for the news_articles table in Supabase");
      console.warn("Make sure admin users have full access to the news_articles table");
    } else {
      console.log("Access to news_articles table confirmed");
    }
  } catch (error) {
    console.error("Error checking access:", error);
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
