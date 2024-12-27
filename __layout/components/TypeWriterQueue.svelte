<script lang="ts">
    import TypeWrtier from "./TypeWriter.svelte";

    type Props = {
        snippeds: [string, ...string[]];
        delay?: number;
        typeingDelay?: number;
        onlyChanges?: boolean;
    };

    const {
        snippeds,
        delay = 1770,
        typeingDelay,
        onlyChanges = true,
    }: Props = $props();

    let toType: number = $state(0);
    let currentSnipped: string = $state(snippeds[0]);

    const calculateDelay = (index: number) => {
        if (index === 0 && onlyChanges) {
            return delay * 2 + snippeds[0].length * 23;
        }
        return delay;
    };

    const ontyped = () => {
        if (toType < snippeds.length - 1) {
            setTimeout(() => {
                toType++;
                currentSnipped = snippeds[toType];
            }, calculateDelay(toType));
        }
    };
</script>

<TypeWrtier
    snipped={currentSnipped}
    delay={typeingDelay}
    {onlyChanges}
    {ontyped}
/>
