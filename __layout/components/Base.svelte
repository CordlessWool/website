<script lang="ts">
    import Header from "./Header.svelte";
    import HeaderSmall from "./HeaderSmall.svelte";
    import { page } from '$embodi/stores';

    import Footer from "./Footer.svelte";
    import '@fontsource/source-code-pro/latin-400.css';
    import '@fontsource/source-code-pro/latin-600.css';
    import sourceSansProWoff2400 from '@fontsource/source-code-pro/files/source-code-pro-latin-400-normal.woff2?url';
    import sourceSansProWoff2600 from '@fontsource/source-code-pro/files/source-code-pro-latin-600-normal.woff2?url';

    import '../../app.css';

    type Props = {
        data: {
            locale: string;
            title: string;
            page_title: string;
            ref?: string;
            description: string;
            company: string;
            canonical?: string;
            meta?: {
              title?: string;
              description?: string;
              keywords?: string;
            };
        }
        light?: boolean;
        children: any;
    };

    const { data, children, light }: Props = $props();
    const { locale, ref, title, page_title } = $state(data);

    const hasMeta = (tag: string) => {
      if(tag === 'title') {
        return !!(data.meta?.title || data.title)
      } else if (tag === 'description') {
        return !!(data.meta?.description || data.description)
      }

      return !!(data.meta && data.meta[tag])

    }


    const getMeta = (tag: string) => {
      if (tag === 'title') {
        return data.meta?.title ?? data.title;
      } else if (tag === 'description') {
        return data.meta?.description ?? data.description;
      }
      return data.meta ? data.meta[tag] : undefined;
    }

    const getLanguageLink = (link: string, lang: string) => new URL(link.replace(/^\/(en|de)\//, `/${lang}/`), 'https://dropanote.de').toString();
    const fullUrl = (link: string) => new URL(link, 'https://dropanote.de').toString();
</script>

<svelte:head>
    <title>{getMeta('title')}</title>
    <link rel="canonical" href={data.canonical ?? fullUrl($page.url)} />
    {#if ref}
        {#if locale === 'de'}
            <link rel="alternate" hreflang="de" href={getLanguageLink($page.url, 'de')} />
            <link rel="alternate" hreflang="en" href={fullUrl(ref)} />
        {:else}
            <link rel="alternate" hreflang="en" href={getLanguageLink($page.url, 'en')} />
            <link rel="alternate" hreflang="de" href={fullUrl(ref)} />
        {/if}
    {:else if $page.url.includes('/en/') || $page.url.includes('/de/')}
        <link rel="alternate" hreflang="de" href={getLanguageLink($page.url, 'de')} />
        <link rel="alternate" hreflang="en" href={getLanguageLink($page.url, 'en')} />
    {/if}
    {#if hasMeta('description')}
        <meta name="description" content={getMeta('description')} />
    {/if}
    {#if hasMeta('keywords')}
        <meta name="keywords" content={getMeta('keywords')} />
    {/if}
    <!-- <link rel="stylesheet" href='../../app.css'> -->
    <link rel="preload" as="font" type="font/woff2" href={sourceSansProWoff2400} crossorigin="anonymous" />
    <link rel="preload" as="font" type="font/woff2" href={sourceSansProWoff2600} crossorigin="anonymous" />
</svelte:head>

{#if light}
    <HeaderSmall pageTitle={page_title} />
{:else}
    <Header {locale} {ref} pageTitle={page_title} />
{/if}

    {@render children()}
<Footer {locale} />
