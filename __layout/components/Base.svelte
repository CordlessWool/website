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
            meta: string;
        }
        light?: boolean;
        children: any;
    };

    const { data, children, light }: Props = $props();
    const { locale, title } = $state(data);
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={data.meta} />
    <!-- <link rel="stylesheet" href='../../app.css'> -->
</svelte:head>

{#if light}
    <HeaderSmall {title} />
{:else}
    <Header {locale} {title} />
{/if}

    {@render children()}
<Footer {locale} />
