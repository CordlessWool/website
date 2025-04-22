<script lang="ts">
    import Header from "./Header.svelte";
    import HeaderSmall from "./HeaderSmall.svelte";
    import { page } from '$embodi/stores';

    import Footer from "./Footer.svelte";

    import '../../app.css';
    import '../remixicon/remixicon.css'

    type Props = {
        data: {
            locale: string;
            title: string;
            description: string;
            company: string;
            meta?: {
              title?: stirng;
              description?: string;
              keywords?: string;
            };
        }
        light?: boolean;
        children: any;
    };

    const { data, children, light }: Props = $props();
    const { locale, title, page_title } = $state(data);

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

</script>

<svelte:head>
    <title>{getMeta('title')}</title>
    <link rel="alternate" hreflang="de" href={getLanguageLink($page.url, 'de')} />
    <link rel="alternate" hreflang="en" href={getLanguageLink($page.url, 'en')} />
    {#if hasMeta('description')}
        <meta name="description" content={getMeta('description')} />
    {/if}
    {#if hasMeta('keywords')}
        <meta name="keywords" content={getMeta('keywords')} />
    {/if}
    <script defer src="https://umami.dropanote.de/script.js" data-website-id="70e54aec-eeb9-4399-8970-484c57461414"></script>
    <!-- <link rel="stylesheet" href='../../app.css'> -->
</svelte:head>

{#if light}
    <HeaderSmall {page_title} />
{:else}
    <Header {locale} {page_title} />
{/if}

    {@render children()}
<Footer {locale} />
