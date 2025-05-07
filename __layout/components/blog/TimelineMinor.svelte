<script lang="ts">
    import TagList from "./TagList.svelte";
    let { post } = $props();
</script>

<div class="direct">
    <TagList tags={post.tags} />
</div>
