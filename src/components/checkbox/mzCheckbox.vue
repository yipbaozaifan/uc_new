<template>
    <label class="mz_checkbox" role="checkbox" :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
    }">
        <span class="mz_checkbox-input" :class="{
            'is-focus': focus,
            'is-disabled': isDisabled,
            'is-checked': isChecked,
        }">
            <span class="mz_checkbox-inner" :class="{'circle': circle}"></span>
            <input type="checkbox" class="mz_checkbox-original" 
                :disabled="isDisabled"
                :value="label"
                :name="name"
                v-model="model"
                @change="handleChange"
                @focus="focus = true"
                @blur="focus = false"
            >
        </span>
        <span class="mz_checkbox-label" v-if="$slots.default || label">
            <slot></slot>
            <template v-if="!$slots.default">{{label}}</template>
        </span>
    </label>
</template>

<script>
export default {
    props: {
        value: {},
        label: {},
        disabled: Boolean,
        checked: Boolean,
        name: String,
        size: String,
        trueLabel: [String, Number],
        circle: Boolean,
    },
    computed: {
        model: {
            get() {
                return this.value !== undefined ? this.value : this.selfModel;
            },
            set(val) { // 单个多选框绑定到布尔值 多个多选框绑定到同一个数组
                console.log(val);
                this.$emit('input', val);
                this.selfModel = val;
            }
        },
        isDisabled() {
            return this.disabled
        },
        store() {
            return this.value
        },
        isChecked() {
            if ({}.toString.call(this.model) === '[object Boolean]') {
                return this.model;
            } else if (Array.isArray(this.model)) {
                return this.model.indexOf(this.label) > -1;
            } else if (this.model !== null && this.model !== undefined) {
                return this.model === this.trueLabel;
            }
        },
    },
    data() {
        return {
            focus: false,
            selfModel: false,
        }
    },
    methods: {
        handleChange(ev) {
            let value;
            if (ev.target.checked) {
                value = true;
            } else {
                value = false;
            }
            this.$emit('change', value, ev);
        }
    }
}
</script>

<style lang="scss">
    .mz_checkbox {
        color: #000000;
        position: relative;
        cursor: pointer;
        display: inline-block;
        white-space: nowrap;
        user-select: none;
        .mz_checkbox-input {
            white-space: nowrap;
            cursor: pointer;
            outline: none;
            display: inline-block;
            line-height: 1;
            position: relative;
            vertical-align: middle;
            &.is-checked {
                .mz_checkbox-inner {
                    &::after {
                        transform: rotate(45deg) scaleY(1);
                    }
                    background-color: #409eff;
                    border-color: #409eff;
                }
            }
            .mz_checkbox-inner {
                &::after {
                    box-sizing: content-box;
                    content: "";
                    border: 1px solid #fff;
                    border-left: 0;
                    border-top: 0;
                    height: 7px;
                    left: 5px;
                    position: absolute;
                    top: 2px;
                    transform: rotate(45deg) scaleY(0);
                    width: 3px;
                    transition: transform .15s ease-in .05s;
                    transform-origin: center;
                }
                display: inline-block;
                position: relative;
                border: 1px solid #dcdfe6;
                border-radius: 2px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                background-color: #fff;
                z-index: 1;
                transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
                &.circle {
                    width: 24px;
                    height: 24px;
                    border-radius: 24px;
                    &::after {
                        content: "";
                        border: 2px solid #fff;
                        border-left: 0;
                        border-top: 0;
                        height: 9px;
                        left: 8px;
                        top: 4px;
                        width: 5px;
                    }
                }
            }
            .mz_checkbox-original {
                opacity: 0;
                outline: none;
                position: absolute;
                margin: 0;
                width: 0;
                height: 0;
                z-index: -1;
            }
        }
        .mz_checkbox-label {
            display: inline-block;
            padding-left: 6px;
            line-height: 19px;
        }
    }
</style>


