

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
import { PointLabel } from "./render/PointLabel";
import { LINE_LABEL_POSITION, LineLabel } from "./render/LineLabel";
import { THINKNESS } from "./Constants";
import { RangeLabel } from "./render/RangleLabel";

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

  // 将背景图片添加到层

  stage.add(layer);

  // const data = randomData(layer);
  let data: any = {
    0: new RangeLabel(
      {
        id: 0,
        start: {
          x: 40,
          y: 120,
        },

        end: {
          x: 120,
          y: 80,
        },

        thinkness: 70,
        offset: [0, 0],
      },
      layer
    ),
    1: new RangeLabel(
      {
        id: 1,
        start: {
          x: 40,
          y: 120,
        },

        end: {
          x: 120,
          y: 80,
        },

        thinkness: 80,
        offset: [0, 0],
      },
      layer
    ),

    2: new RangeLabel(
      {
        id: 2,
        start: {
          x: 40,
          y: 120,
        },

        end: {
          x: 120,
          y: 80,
        },

        thinkness: 90,
        offset: [0, 0],
      },
      layer
    ),
    3: new RangeLabel(
      {
        id: 3,
        start: {
          x: 40,
          y: 120,
        },

        end: {
          x: 120,
          y: 80,
        },

        thinkness: 100,
        offset: [0, 0],
      },
      layer
    ),
    4: new RangeLabel(
      {
        id: 4,
        start: {
          x: 40,
          y: 120,
        },

        end: {
          x: 120,
          y: 80,
        },

        thinkness: 110,
        offset: [0, 0],
      },
      layer
    ),
    // 2: new RangeLabel(
    //   {
    //     id: 2,
    //     start: {
    //       x: 80,
    //       y: 120,
    //     },

    //     end: {
    //       x: 120,
    //       y: 50,
    //     },

    //     thinkness: 30,
    //     offset: [0, 0],
    //   },
    //   layer
    // ),
  };

  Object.keys(data).forEach((key) => {
    data[key].render();
  });

  const collision = new Collision(data);

  result.value = collision.optimize(group);

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
.container {
  background: #eee;
}
</style>
