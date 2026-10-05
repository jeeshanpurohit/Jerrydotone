import React from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

/**
 * BackgroundShaderGradient
 * Architectural dynamic 3D web shader background powered by @shadergradient/react.
 * Tuned to Jeeshan Purohit's signature brand palette (Vermillion #FF5A00, Deep Teal #0B6E76, Charcoal #10191A).
 */
export default function BackgroundShaderGradient({
  type = "plane",
  color1 = "#FF5A00",
  color2 = "#0B6E76",
  color3 = "#10191A",
  uSpeed = 0.25,
  uStrength = 2.4,
  uFrequency = 4.0,
  cDistance = 28,
  cPolarAngle = 110,
  opacity = 0.65,
  wireframe = false,
  style = {}
}) {
  return (
    <div
      className="sp-shader-gradient-wrap"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        opacity,
        ...style
      }}
    >
      <ShaderGradientCanvas
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        pixelDensity={1.2}
        fov={45}
        lazy
      >
        <ShaderGradient
          control="props"
          type={type}
          animate="on"
          uSpeed={uSpeed}
          uStrength={uStrength}
          uFrequency={uFrequency}
          cDistance={cDistance}
          cPolarAngle={cPolarAngle}
          color1={color1}
          color2={color2}
          color3={color3}
          lightType="3d"
          wireframe={wireframe}
          brightness={1.0}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
