

<template>
  <div id="container"></div>

  <div id="result" v-if="result">
    <div>重叠标签累计:{{ result.total }}</div>

    <div>镜像避让数:{{ result.mirro }}</div>

    <div>移动避让:{{ result.move }}</div>

    <div>未处理避让数:{{ result.overlap }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Konva from "konva";
import { randomData } from "./Tools/Tools";
import { Collision } from "./render/Collision";

const result: any = ref(null);

onMounted(() => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const stage = new Konva.Stage({
    container: "container",
    width: width,
    height: height,
  });

  const layer = new Konva.Layer();

  // const imageObj = new Image();

  const group = new Konva.Group();

  group.zIndex(2);
  layer.add(group);

  // imageObj.onload = function () {
  //   const background = new Konva.Image({
  //     x: 0,
  //     y: 0,
  //     image: imageObj,
  //     width: stage.width(),
  //     height: stage.height(),
  //   });
  //   background.zIndex(0);
  //   // 将背景图片添加到图层
  //   group.add(background);
  //   layer.draw(); // 渲染图层
  // };

  // 设置你的图片路径
  // imageObj.src = "/public/test.png"; // 替换为你的图片 URL

  // 将背景图片添加到层

  stage.add(layer);

  const data = randomData(layer);

  Object.keys(data).forEach((key) => {
    data[key].render();
  });

  const collision = new Collision(data);

  result.value = collision.optimize();

  layer.draw();
});
</script>


<style scoped>
/* #container {
} */

#result {
  position: absolute;
  right: 20px;
  top: 20px;
}
</style>
