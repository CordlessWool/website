<script lang="ts">
    import Header from "./Header.svelte";
    import Footer from "./Footer.svelte";
    import '../../app.css';

    type Props = {
        data: {
            locale: string;
            title: string;
            page: string;
        }
        children: any;
    };

    const { data, children }: Props = $props();
    const { locale, title, page } = $state(data);
</script>

<Header {locale} {title} {page} />
    {@render children()}
<Footer {locale} />
