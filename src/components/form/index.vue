<template>
  <div>
    <!-- <ElementTest></ElementTest> -->

    <!-- KForm -->
    <KInput v-model="model.username" placeholder="请输入用户名"></KInput>
  </div>
</template>

<script>
// import ElementTest from "@/components/form/ElementTest.vue";
import KInput from "@/components/form/KInput.vue";
// import KFormItem from "@/components/form/KFormItem.vue";
// import KForm from "@/components/form/KForm.vue";

export default {
  components: {
    // ElementTest,
    KInput,
    // KFormItem,
    // KForm,
  },
  data() {
    return {
      model: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "用户名为必填项" }],
        password: [{ required: true, message: "aaaaaaa" }],
      },
    };
  },
  methods: {
  },
};
</script>

<style scoped></style>
