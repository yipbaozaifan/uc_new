<template>
    <div class="content header">
        <a :href="link" class="logo logo-meizu">
            <i class="icon header-icon"></i>
        </a>
    </div>
</template>

<script>
export default {
    props:{
        link: {
            type: String,
            default: 'https://www.meizu.com/'
        }
    },
    name: 'mzheader',
}
</script>

<style lang="scss">
    .header {
        height: 30px;
        margin: 0;
        position: relative;
        padding-top: 45px;
        max-width: 1200px;
        margin: 0 auto;
        .logo-meizu {
            display: block;
            width: 110px;
            height: 20px;
            float: left;
            overflow: hidden;
            .header-icon {
                display: block;
                background-position: -2px -4px;
            }
        }
    }
</style>


