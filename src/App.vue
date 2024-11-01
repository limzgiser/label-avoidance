

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

  layer.draw();

  const collision = new Collision(data);

  collision.optimize();

  // 重叠的标签
  const overlapData = collision.getRectangle();

  // console.log(overlapData);

  const keys = Object.keys(overlapData);

  const _group = new Konva.Group();

  layer.add(_group);

  layer.draw();

  for (let i = 0; i < keys.length; i++) {
    const id = keys[i];
    const rect: Rectangle = overlapData[id];

    const [p1, p2, p3, p4] = rect.points;
    const path = new Konva.Shape({
      sceneFunc: function (context, shape) {
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.lineTo(p3.x, p3.y);
        context.lineTo(p4.x, p4.y);

        context.lineTo(p1.x, p1.y);
        context.strokeShape(this);
      },

      stroke: "red",
      strokeWidth: 1,
    });

    _group.add(path);
  }
});
</script>


<style scoped>
/* #container {
} */
</style>
