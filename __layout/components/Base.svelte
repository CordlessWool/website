<script lang="ts">
    import Header from "./Header.svelte";
    import HeaderSmall from "./HeaderSmall.svelte";

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
</script>

<svelte:head>
    <title>{getMeta('title')}</title>
    {#if hasMeta('description')}
        <meta name="description" content={getMeta('description')} />
    {/if}
    {#if hasMeta('keywords')}
        <meta name="keywords" content={getMeta('keywords')} />
    {/if}
    <!-- <link rel="stylesheet" href='../../app.css'> -->
</svelte:head>

{#if light}
    <HeaderSmall {page_title} />
{:else}
    <Header {locale} {page_title} />
{/if}

    {@render children()}
<Footer {locale} />
