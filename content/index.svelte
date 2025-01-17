<script>
    import Base from "$layout/components/Base.svelte";

    const { data } = $props();
</script>

<svelte:head>
    <script type="text/javascript">
        // On page load or when changing themes, best to add inline in `head` to avoid FOUC
        var lang = navigator.language || navigator.userLanguage;
        if (lang.indexOf("de") == 0) window.location = "/de/";
        else window.location = "/en/";
    </script>
</svelte:head>

<Base
    data={{
        ...data,
        title: "Wolfgang Rathgeb",
        meta: "Welcome! My name is Wolfgang Rathgeb and I am a freelancing Software Engineer",
    }}
    light
>
    <main>
        <h2>You wanna <b>drop a note</b>?</h2>
        <p>
            You should be automatically redirected. If you are not automatically
            redirected, please select a language.
        </p>
        <div>
            <a href="https://dropanote.de/de">Deutsch</a>
            /
            <a href="https://dropanote.de/en">English</a>
        </div>
    </main>
</Base>

<style lang="postcss">
    main {
        @apply flex h-full flex-col items-center justify-center gap-3 p-3 md:p-7;
        @apply text-center;
        @apply flex-grow;
        @apply max-w-screen-sm mx-auto;
    }

    h2 {
        @apply text-3xl font-normal;
    }

    a {
        @apply relative hover:underline hover:font-bold focus:underline focus:font-bold underline-offset-2 p-2;
    }

    b {
        @apply font-bold;
    }

    div {
        @apply text-xl mt-11;
    }
</style>
