import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";

interface AvatarViewerProps {
  modelPath: string;
}

const AvatarViewer: React.FC<AvatarViewerProps> = ({ modelPath }) => {
  const avatar = useFBX(modelPath);

  return (
    <Canvas camera={{ position: [0, 50, 100] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <primitive object={avatar} />
      <OrbitControls />
    </Canvas>
  );
};

export default AvatarViewer;
