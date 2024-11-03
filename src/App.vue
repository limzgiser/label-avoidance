

<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Konva from "konva";
import { randomData } from "./Tools/Tools";

import { Collision } from "./render/Collision";
import { Rectangle } from "./render/Rectangle";
import { RangeLabel } from "./render/RangleLabel";
import { THINKNESS } from "./Constants";

onMounted(() => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const stage = new Konva.Stage({
    container: "container",
    width: width,
    height: height,
  });

  const layer = new Konva.Layer();

  stage.add(layer);

  const data = randomData(layer);

  // const data = {
  //   11: new RangeLabel(
  //     {
  //       id: 11,
  //       start: {
  //         x: 100,
  //         y: 100,
  //       },

  //       end: {
  //         x: 200,
  //         y: 200,
  //       },

  //       thinkness: 10,
  //       offset: [0, 0],
  //     },
  //     layer
  //   ),
  //   12: new RangeLabel(
  //     {
  //       id: 12,
  //       start: {
  //         x: 100,
  //         y: 200,
  //       },

  //       end: {
  //         x: 230,
  //         y: 100,
  //       },

  //       thinkness: 10,
  //       offset: [0, 0],
  //     },
  //     layer
  //   ),
  // };

  Object.keys(data).forEach((key) => {
    data[key].render();
  });
  layer.draw();

  const collision = new Collision(data);

  collision.optimize();

  // // 重叠的标签
  // const overlapData = collision.getRectangle();

  // const keys = Object.keys(overlapData);

  // const _group = new Konva.Group();

  // layer.add(_group);

  // for (let i = 0; i < keys.length; i++) {
  //   const id = keys[i];
  //   const rect: Rectangle = overlapData[id];

  //   const [p1, p2, p3, p4] = rect.points;
  //   const path = new Konva.Shape({
  //     sceneFunc: function (context, shape) {
  //       context.beginPath();
  //       context.moveTo(p1.x, p1.y);
  //       context.lineTo(p2.x, p2.y);
  //       context.lineTo(p3.x, p3.y);
  //       context.lineTo(p4.x, p4.y);

  //       context.lineTo(p1.x, p1.y);
  //       context.strokeShape(this);
  //     },

  //     stroke: "red",
  //     strokeWidth: 1,
  //   });

  //   _group.add(path);
  // }

  layer.draw();
});
</script>


<style scoped>
/* #container {
} */
</style>
