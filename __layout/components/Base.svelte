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
            company: string;
            meta: string;
        }
        light?: boolean;
        children: any;
    };

    const { data, children, light }: Props = $props();
    const { locale, title, company } = $state(data);
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={data.meta} />
    <!-- <link rel="stylesheet" href='../../app.css'> -->
</svelte:head>

{#if light}
    <HeaderSmall {company} />
{:else}
    <Header {locale} {company} />
{/if}

    {@render children()}
<Footer {locale} />
