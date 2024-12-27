<script lang="ts">
    import Header from "./Header.svelte";
    import Footer from "./Footer.svelte";

    import '../../app.css';
    import '../remixicon/remixicon.css'

    type Props = {
        data: {
            locale: string;
            title: string;
            meta: string;
        }
        children: any;
    };

    const { data, children }: Props = $props();
    const { locale, title } = $state(data);
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={data.meta} />
    <!-- <link rel="stylesheet" href='../../app.css'> -->
</svelte:head>

<Header {locale} {title} />
    {@render children()}
<Footer {locale} />
