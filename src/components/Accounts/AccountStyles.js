import { ImageBackground, View,Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import styled from "styled-components";
import { colors } from "../../infrastructure/theme/colors";

export const AccountBackground=styled(ImageBackground)`
background-color: ${props=>props.theme.colors.bg.secondary};
flex: 1;
align-items:center;
justify-content:center;
`;

export const AccountContainer=styled(View)`
background-color:${props=>props.theme.colors.bg.primary};
padding: ${(props)=>props.theme.space[4]};
margin-top: ${(props)=>props.theme.space[2]};
`;

export const AuthButton=styled(Button).attrs({
    buttonColor : colors.ui.tertiary,
    
})`
border-radius:7px;
padding: ${(props)=>props.theme.space[2]};

`;

export const AuthInput=styled(TextInput)`
width: 300px;
`;

export const Title=styled(Text)`
font-size: 30px;
color: ${props=>props.theme.colors.text.primary};
`;

