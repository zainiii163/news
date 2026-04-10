"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { AdSlot } from "@/components/ads/ad-slot";
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/providers/AuthProvider";
import { newsApi } from "@/lib/api/modules/news.api";
import { getImageUrl } from "@/lib/helpers/imageUrl";
import { categorySectionHref } from "@/lib/helpers/category-routes";
// import { formatRelativeTime } from "@/lib/helpers/dateFormatter";
import { NewsDetail } from "@/types/news.types";

export default function ArticlePage() {
  const { t, language } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showFollowMenu, setShowFollowMenu] = useState(false);

  useEffect(() => {
    const slug = params.slug;
    if (slug && typeof slug === 'string') {
      // Fetch article data based on slug
      newsApi.getByIdOrSlug(slug)
        .then((response) => {
          if (response.data?.data) {
            setArticle(response.data.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching article:', error);
          router.push('/404');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params.slug, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const calculateReadTime = (content: string) => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const totalWords = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(totalWords / wordsPerMinute);
    return `${readTime} min read`;
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/dialog/share?app_id=80401312489&href=${encodeURIComponent(url)}&display=popup`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this article: ${title}`)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(`CNN content share`)}&body=${encodeURIComponent(`Check out this article:\n${url}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied!');
        break;
      case 'threads':
        window.open(`https://www.threads.com/intent/post?text=${encodeURIComponent(`Check out this article: ${title}`)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  const handleFollowTopic = (topic: string) => {
    // In real implementation, handle follow logic
    console.log('Following topic:', topic);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading article...</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Article not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="layout-article-elevate__content-wrapper layout__content-wrapper">
        {/* INFO SECTION */}
        <section className="layout-article-elevate__info" data-editable="topLayout" data-track-zone="topLayout">
          <div className="alerts-elevate"></div>
        </section>

        {/* BREADCRUMB */}
        <section className="layout-article-elevate__breadcrumb" data-editable="breadcrumb" data-track-zone="breadcrumb">
          <div className="breadcrumb-elevate vossi-breadcrumb_elevate breadcrumb__margin-article vossi-breadcrumb_elevate__margin-article">
            <Link href={categorySectionHref(article.category?.slug || "general")} className="breadcrumb__link vossi-breadcrumb_elevate__link breadcrumb__parent-link vossi-breadcrumb_elevate__parent-link">
              {article.category?.nameEn || 'General'}
            </Link>
            <span className="breadcrumb__read-time-separator vossi-breadcrumb_elevate__read-time-separator" aria-hidden="true"></span>
            <span className="breadcrumb__read-time vossi-breadcrumb_elevate__read-time" aria-hidden="true">{calculateReadTime(article.content)}</span>
          </div>
        </section>

        {/* TOP SECTION */}
        <section className="layout-article-elevate__top layout__top" data-editable="top" data-track-zone="top">
          <div className="headline-elevate vossi-headline_elevate headline--has-lowertext" data-component-name="headline">
            <div className="headline__wrapper">
              <div data-editable="settings"></div>
              <div className="headline__kicker" data-editable="kicker"></div>
              <h1 data-editable="headlineText" className="headline__text vossi-headline_elevate__text inline-placeholder" id="maincontent">
                {article.title}
              </h1>
            </div>
            <div className="headline__footer vossi-headline_elevate__footer">
              <div className="headline__sub-container vossi-headline_elevate__sub-container">
                <div className="headline__sub-text vossi-headline_elevate__sub-text">
                  <div className="vossi-byline_elevate byline-elevate" data-editable="settings">
                    <div className="byline__authors vossi-byline_elevate__authors">
                      By 
                      <div className="byline__author vossi-byline_elevate__author">
                        {article.author?.avatar && (
                          <Link className="byline__image-link vossi-byline_elevate__link" href={`/profiles/${article.author.id}`}>
                            <span>
                              <div className="byline__image vossi-byline_elevate__image w-12 h-12 rounded-full overflow-hidden relative">
                                <Image
                                  src={getImageUrl(article.author.avatar)}
                                  alt={article.author.name || 'Author'}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            </span>
                          </Link>
                        )}
                        <Link className="byline__link vossi-byline_elevate__link" href={`/profiles/${article.author?.id}`}>
                          <span className="byline__name vossi-byline_elevate__name">{article.author?.name || 'CNN Staff'}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="headline__byline-sub-text">
                  <div className="timestamp-elevate vossi-timestamp_elevate" data-editable="settings">
                    <div className="timestamp__container vossi-timestamp_elevate__container">
                      <noscript>
                        <div>
                          <time dateTime={article.publishedAt || ''}>Updated {formatDate(article.publishedAt || '')}</time>
                          <time dateTime={article.publishedAt || ''}>Published {formatDate(article.publishedAt || '')}</time>
                        </div>
                      </noscript>
                      <span className="timestamp__time-since vossi-timestamp_elevate__time-since" data-first-publish={article.publishedAt || ''} data-last-publish={article.updatedAt || article.publishedAt || ''}>
                        {formatDate(article.publishedAt || '')}
                      </span>
                      <span className="vossi-timestamp_elevate__expand-btn"></span>
                    </div>
                    <div className="timestamp__details vossi-timestamp_elevate__details">
                      <div className="timestamp__published vossi-timestamp_elevate__published">
                        PUBLISHED <time dateTime={article.publishedAt || ''}>{formatDate(article.publishedAt || '')}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="headline__options vossi-headline_elevate__options"></div>
            </div>
          </div>
        </section>

        {/* MAIN LAYOUT */}
        <section className="layout__wrapper layout-article-elevate__wrapper">
          <section className="layout__main layout-article-elevate__main">
            <section className="layout__left layout-article-elevate__left tabcontent active" data-tabcontent="Content" data-editable="left" data-track-zone="left" style={{marginTop: '0px'}}></section>
            <section className="layout__center layout-article-elevate__center" data-editable="main" data-track-zone="main" data-reorderable="main">
              <article className="article" role="main" data-drag-disable="true" data-unselectable="true" data-show-regwall="false" data-show-paywall="true" data-subscription-only="false">
                <div className="scroll-depth-observer scroll-100"></div>
                <div className="scroll-depth-observer scroll-75"></div>
                <div className="scroll-depth-observer scroll-50"></div>
                <div className="scroll-depth-observer scroll-25"></div>
                
                <script>
                  {`
                    window.CNN.contentModel.leadingMediaType = 'image';
                    window.CNN.contentModel.isVideoCollection = false;
                  `}
                </script>
                
                <section className="body tabcontent active" data-tabcontent="Content">
                  <main className="article__main">
                    {/* LEDE IMAGE */}
                    <div className="image__lede article__lede-wrapper" data-editable="lede" data-freewheel-lede="true">
                      {article.mainImage && (
                        <div className="image_large-elevate vossi-image_large-elevate image_large__hide-placeholder image_large--eq-extra-small image_large--eq-small image_large--eq-large" data-image-variation="image_large" data-component-name="image">
                          <div className="image_large__container" data-image-variation="image_large">
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                              <OptimizedImage
                                src={getImageUrl(article.mainImage)}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority={true}
                                quality={90}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                              />
                            </div>
                          </div>
                          {article.content && (
                            <div 
                              className="paragraph-elevate inline-placeholder vossi-paragraph_elevate"
                              dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* ACTION BAR */}
                    <div className="action-bar vossi-action-bar" data-editable="settings">
                      <div className="vossi-action-bar__overlay action-bar__overlay"></div>
                      <div className="vossi-action-bar__action-sheet action-bar__action-sheet" tabIndex={-1}>
                        <div className="vossi-action-bar__action-sheet--header action-bar__action-sheet--header">
                          <div className="vossi-action-bar__action-sheet--header-title action-bar__action-sheet--header-title"></div>
                          <div className="vossi-action-bar__action-sheet--header-close action-bar__action-sheet--header-close">
                            <svg className="icon-ui-close" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19.787 18.758l-6.792-6.781 6.746-6.735a.728.728 0 00-1.028-1.03l-6.747 6.737-6.711-6.7a.728.728 0 00-1.028 1.03l6.71 6.698-6.723 6.712a.727.727 0 101.027 1.03l6.725-6.714 6.793 6.782a.725.725 0 001.028 0 .727.727 0 000-1.03"></path>
                            </svg>
                          </div>
                        </div>
                        
                        <div className="vossi-action-bar__action-sheet--action action-bar__action-sheet--action" data-title="follow">
                          <div className="follow-topics-bar follow-topics-bar_overlay follow-topics-bar--hide">
                            <div className="follow-topics-bar_overlay__inner">
                              <div className="follow-topics-bar_overlay__scroll-wrapper" tabIndex={-1}>
                                {article.tags && Array.isArray(article.tags) ? (
                                  article.tags.map((topic: string, index: number) => (
                                    <button
                                      key={index}
                                      data-unselectable="true"
                                      className="chip follow-topics-chip"
                                      data-component-variation="follow-topics-chip"
                                      data-component-name="chip"
                                      onClick={() => handleFollowTopic(topic)}
                                    >
                                      <span className="chip__label">{topic}</span>
                                      <span className="chip__icon">
                                        <span className="chip__icon--check"></span>
                                        <span className="chip__icon--add"></span>
                                      </span>
                                    </button>
                                  ))
                                ) : (
                                  <span>No topics available</span>
                                )}
                              </div>
                              <div className="follow-topics-bar_overlay__fade follow-topics-bar_overlay__fade--hide"></div>
                              <a className="follow-topics-bar_overlay__explore-more-link" href="/follow">
                                See all topics
                                <svg className="icon-ui-caret-right" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M17.218 11.522c.28.261.28.685 0 .946L7.2 21.794c-.242.225-.632.28-.91.093a.613.613 0 01-.088-.975l9.579-8.917-9.538-8.878c-.242-.225-.3-.589-.1-.847a.721.721 0 011.048-.082l10.027 9.334z"></path>
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                        
                        <div className="vossi-action-bar__action-sheet--action action-bar__action-sheet--action" data-title="share options">
                          <div className="vossi-social-share_labelled-list social-share_labelled-list">
                            <div className="vossi-social-share_labelled-list__share-links social-share_labelled-list social-share_labelled-list__share-links" data-type="share-links">
                              <button className="vossi-social-share_labelled-list__share social-share_labelled-list__share" onClick={() => handleShare('facebook')}>
                                <svg className="icon-facebook-circle" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M8.04139 1.33301C11.7458 1.33301 14.7488 4.33601 14.7488 8.04042C14.7488 11.3884 12.296 14.1632 9.08943 14.6663V9.97928H10.6523L10.9497 8.04042H9.08943V6.78225C9.08943 6.25182 9.34934 5.73475 10.1825 5.73475H11.0283V4.08409C11.0283 4.08409 10.2607 3.95309 9.52685 3.95309C7.99476 3.95309 6.99336 4.88165 6.99336 6.56269V8.04042H5.29031V9.97928H6.99336V14.6663C3.78677 14.1632 1.33398 11.3882 1.33398 8.04042C1.33398 4.33601 4.33699 1.33301 8.04139 1.33301Z" fill="#0C0C0C"></path>
                                </svg>
                                <span className="vossi-social-share_labelled-list__share-links__label social-share_labelled-list__share-links--label">Facebook</span>
                              </button>
                              <button className="vossi-social-share_labelled-list__share social-share_labelled-list__share" onClick={() => handleShare('twitter')}>
                                <svg className="icon-x-share" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M5.99386 8.11503L0 0.666992H4.74756L8.44753 5.27039L12.4004 0.687719H15.0151L9.71175 6.84331L16 14.667H11.2666L7.2603 9.6887L2.98317 14.6532H0.354296L5.99386 8.11503ZM11.9565 13.287L2.91105 2.04698H4.0571L13.0912 13.287H11.9565Z" fill="#0C0C0C"></path>
                                </svg>
                                <span className="vossi-social-share_labelled-list__share-links__label social-share_labelled-list__share-links--label">Tweet</span>
                              </button>
                              <button className="vossi-social-share_labelled-list__share social-share_labelled-list__share" onClick={() => handleShare('email')}>
                                <svg className="icon-email-share" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M2 6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6ZM4 6H20V9.11604L12 11.9396L4 9.11604V6ZM4 11.237V18H20V11.237L12.3328 13.943C12.1174 14.019 11.8825 14.019 11.6672 13.943L4 11.237Z" fill="#0C0C0C"></path>
                                </svg>
                                <span className="vossi-social-share_labelled-list__share-links__label social-share_labelled-list__share-links--label">Email</span>
                              </button>
                              <button className="vossi-social-share_labelled-list__share social-share_labelled-list__share" onClick={() => handleShare('copy')}>
                                <svg className="icon-hyperlink" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M5.64373 10.3574C5.38338 10.0971 5.38338 9.67496 5.64373 9.41461L9.88637 5.17197C10.1467 4.91162 10.5688 4.91162 10.8292 5.17197C11.0895 5.43232 11.0895 5.85443 10.8292 6.11478L6.58654 10.3574C6.32619 10.6178 5.90408 10.6178 5.64373 10.3574Z" fill="#0C0C0C"></path>
                                  <path d="M4.22952 8.94321L5.64373 7.52899C5.90408 7.26865 5.90408 6.84654 5.64373 6.58619C5.38338 6.32584 4.96127 6.32584 4.70092 6.58619L3.28671 8.0004C1.98496 9.30215 1.98496 11.4127 3.28671 12.7144C4.58846 14.0162 6.69901 14.0162 8.00075 12.7144L9.41497 11.3002C9.67532 11.0399 9.67532 10.6178 9.41497 10.3574C9.15462 10.0971 8.73251 10.0971 8.47216 10.3574L7.05795 11.7716C6.2769 12.5527 5.01057 12.5527 4.22952 11.7716C3.44847 10.9906 3.44847 9.72426 4.22952 8.94321Z" fill="#0C0C0C"></path>
                                  <path d="M8.94356 4.22916L7.52935 5.64338C7.269 5.90373 6.84689 5.90373 6.58654 5.64338C6.32619 5.38303 6.32619 4.96092 6.58654 4.70057L8.00075 3.28635C9.3025 1.98461 11.4131 1.98461 12.7148 3.28635C14.0165 4.5881 14.0165 6.69865 12.7148 8.0004L11.3006 9.41461C11.0402 9.67496 10.6181 9.67496 10.3578 9.41461C10.0974 9.15426 10.0974 8.73215 10.3578 8.4718L11.772 7.05759C12.553 6.27654 12.553 5.01021 11.772 4.22916C10.9909 3.44812 9.72461 3.44811 8.94356 4.22916Z" fill="#0C0C0C"></path>
                                </svg>
                                <span className="vossi-social-share_labelled-list__share-links__label social-share_labelled-list__share-links--label">Link</span>
                              </button>
                              <button className="vossi-social-share_labelled-list__share social-share_labelled-list__share" onClick={() => handleShare('threads')}>
                                <svg className="icon-threads" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-4 0 28 24" xmlSpace="preserve" width="16" height="16">
                                  <g><path d="M10.721 24h-0.007c-3.581 -0.024 -6.334 -1.205 -8.184 -3.509C0.886 18.439 0.036 15.586 0.007 12.01v-0.017c0.029 -3.578 0.878 -6.43 2.525 -8.482C4.38 1.205 7.135 0.024 10.714 0h0.014c2.746 0.019 5.042 0.725 6.826 2.098 1.678 1.291 2.858 3.13 3.509 5.467l-2.04 0.569c-1.104 -3.96 -3.898 -5.983 -8.304 -6.014 -2.909 0.022 -5.11 0.936 -6.54 2.717C2.842 6.504 2.15 8.914 2.124 12c0.026 3.086 0.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623 -0.019 4.358 -0.631 5.801 -2.045 1.646 -1.613 1.618 -3.593 1.09 -4.798 -0.31 -0.71 -0.874 -1.301 -1.634 -1.75 -0.192 1.351 -0.622 2.446 -1.284 3.271 -0.886 1.102 -2.141 1.704 -3.73 1.79 -1.202 0.065 -2.362 -0.218 -3.259 -0.802 -1.063 -0.689 -1.685 -1.74 -1.752 -2.964 -0.065 -1.19 0.408 -2.285 1.33 -3.082 0.881 -0.761 2.119 -1.207 3.583 -1.291 1.078 -0.06 2.088 -0.012 3.019 0.142 -0.125 -0.742 -0.374 -1.332 -0.749 -1.757 -0.514 -0.586 -1.308 -0.883 -2.359 -0.89h-0.029c-0.845 0 -1.992 0.233 -2.722 1.32L6.269 7.848c0.979 -1.454 2.568 -2.256 4.478 -2.256h0.043c3.194 0.019 5.098 1.975 5.287 5.388 0.108 0.046 0.216 0.094 0.322 0.142 1.49 0.701 2.58 1.762 3.154 3.07 0.797 1.822 0.871 4.79 -1.548 7.159C16.154 23.16 13.91 23.978 10.728 24zm1.003 -11.69c-0.242 0 -0.487 0.007 -0.739 0.022 -1.836 0.103 -2.981 0.946 -2.916 2.143 0.067 1.255 1.452 1.838 2.784 1.766 1.224 -0.065 2.818 -0.542 3.086 -3.71 -0.677 -0.146 -1.418 -0.221 -2.215 -0.221"></path></g>
                                </svg>
                                <span className="vossi-social-share_labelled-list__share-links__label social-share_labelled-list__share-links--label">Threads</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="vossi-action-bar__buttons action-bar__buttons">
                        <button className="vossi-action-bar__button action-bar__button" data-title="follow" onClick={() => setShowFollowMenu(!showFollowMenu)}>
                          <svg className="add-icon" width="24" height="24" viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4L11 11L4 11C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13L11 13L11 20C11 20.5523 11.4477 21 12 21C12.5523 21 13 20.5523 13 20V13L20 13C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11L13 11V4Z" fill=""></path>
                          </svg>
                          Follow
                        </button>
                        <button className="vossi-action-bar__button action-bar__button" data-title="share options" onClick={() => setShowShareMenu(!showShareMenu)}>
                          <svg className="icon-share-action" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.42616 1.48753C8.17892 1.2815 7.81981 1.2815 7.57258 1.48753L5.57258 3.15419C5.28972 3.3899 5.25151 3.81028 5.48722 4.09313C5.72293 4.37598 6.1433 4.4142 6.42616 4.17849L7.3327 3.42304V8.99968C7.3327 9.36787 7.63118 9.66634 7.99937 9.66634C8.36756 9.66634 8.66603 9.36787 8.66603 8.99968V3.42304L9.57258 4.17849C9.85543 4.4142 10.2758 4.37598 10.5115 4.09313C10.7472 3.81028 10.709 3.3899 10.4262 3.15419L8.42616 1.48753ZM11.3327 6.66634H9.99935V5.33301H11.3327C12.4373 5.33301 13.3327 6.22844 13.3327 7.33301V12.6663C13.3327 13.7709 12.4373 14.6663 11.3327 14.6663H4.66602C3.56145 14.6663 2.66602 13.7709 2.66602 12.6663V7.33301C2.66602 6.22844 3.56145 5.33301 4.66602 5.33301H5.99935V6.66634H4.66602C4.29783 6.66634 3.99935 6.96482 3.99935 7.33301V12.6663C3.99935 13.0345 4.29783 13.333 4.66602 13.333H11.3327C11.7009 13.333 11.9993 13.0345 11.9993 12.6663V7.33301C11.9993 6.96482 11.7009 6.66634 11.3327 6.66634Z" fill="#0C0C0C"></path>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* ARTICLE CONTENT */}
                    <div className="article__content" data-editable="content" itemProp="articleBody" data-reorderable="content">
                      {article.content && (
                        <div 
                          className="paragraph-elevate inline-placeholder vossi-paragraph_elevate"
                          dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                      )}
                    </div>
                    
                    {/* ADVERTISEMENT IN CONTENT */}
                    <div className="quantum-wrapper ad-slot-wrapper qtm-element">
                      <div className="qtm-slot-inner ad-qtm adfuel-rendered" data-ad-text="show" data-ad-refresh="adbody">
                        <AdSlot slot="MID_PAGE" />
                      </div>
                    </div>
                  </main>
                </section>
              </article>
            </section>
          </section>
        </section>
      </div>

      {/* MORE ARTICLES SECTION */}
      <div className="mt-16 pt-8 border-t border-gray-200 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">More articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group cursor-pointer">
            <Link href="/news/sample-article-1">
              <div className="relative w-full h-48 overflow-hidden rounded-lg mb-3">
                <div className="w-full h-full bg-gray-200"></div>
              </div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-2 leading-tight">
                Sample Article Title 1
              </h3>
              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
            </Link>
          </div>
          <div className="group cursor-pointer">
            <Link href="/news/sample-article-2">
              <div className="relative w-full h-48 overflow-hidden rounded-lg mb-3">
                <div className="w-full h-full bg-gray-200"></div>
              </div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-2 leading-tight">
                Sample Article Title 2
              </h3>
              <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
            </Link>
          </div>
          <div className="group cursor-pointer">
            <Link href="/news/sample-article-3">
              <div className="relative w-full h-48 overflow-hidden rounded-lg mb-3">
                <div className="w-full h-full bg-gray-200"></div>
              </div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-2 leading-tight">
                Sample Article Title 3
              </h3>
              <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
