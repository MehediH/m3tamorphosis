import { Text } from "drei";

export default function LargeText({ body, position, factor, color, fontSize, anchorX, anchorY }){
    return (
        <Text
            color={color}
            fontSize={fontSize}
            letterSpacing={0.02}
            textAlign={'center'}
            font="https://fonts.gstatic.com/s/delagothicone/v1/hESp6XxvMDRA-2eD0lXpDa6QkBAGRg.woff"
            position={position}
            factor={factor}
            anchorX={anchorX}
            anchorY={anchorY}
        >
            {body}
        </Text>
    )
}