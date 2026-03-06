delicias-do-mar-app
│
├── App.js
├── firebase.js
│
├── screens
│   ├── LoginScreen.js
│   ├── WaiterScreen.js
│   ├── CustomerScreen.js
│   ├── ManagerScreen.js
│   └── MenuScreen.js
│
├── components
│   ├── MenuItem.js
│   ├── TableCard.js
│   └── OrderItem.js
│
└── data
    └── menu.js

npx create-expo-app delicias-do-mar
cd delicias-do-mar

firebase.js

npm install firebase
npm install @react-navigation/native
npm install @react-navigation/native-stack

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "delicias-do-mar.firebaseapp.com",
  projectId: "delicias-do-mar",
  storageBucket: "delicias-do-mar.appspot.com",
  messagingSenderId: "000000",
  appId: "000000"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

data/menu.js

export const menu = [

{nome:"Pratiqueira",preco:60,categoria:"Peixes"},
{nome:"Pescadinha 3 unidades",preco:75,categoria:"Peixes"},
{nome:"Pescadinha 6 unidades",preco:70,categoria:"Peixes"},
{nome:"Filé de Pescada Adoré",preco:85,categoria:"Peixes"},
{nome:"Filé de Pescada com fritas",preco:100,categoria:"Peixes"},
{nome:"Isca de peixe",preco:70,categoria:"Peixes"},
{nome:"Camarão alho e óleo",preco:90,categoria:"Peixes"},
{nome:"Camarão à milanesa",preco:100,categoria:"Peixes"},

{nome:"Filé de carne na chapa",preco:100,categoria:"Carnes"},
{nome:"Bife acebolado",preco:80,categoria:"Carnes"},
{nome:"Frango na chapa",preco:70,categoria:"Carnes"},

{nome:"Arroz",preco:7,categoria:"Porções"},
{nome:"Farofa",preco:7,categoria:"Porções"},
{nome:"Vinagrete",preco:7,categoria:"Porções"},

{nome:"Skol 600ml",preco:13,categoria:"Bebidas"},
{nome:"Brahma 600ml",preco:13,categoria:"Bebidas"},
{nome:"Refrigerante lata",preco:7,categoria:"Bebidas"},
{nome:"Coca-Cola 2L",preco:18,categoria:"Bebidas"}

];

screens/LoginScreen.js

import React, {useState} from "react";
import {View,Text,TextInput,Button} from "react-native";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase";

export default function LoginScreen({navigation}){

const [email,setEmail]=useState("");
const [senha,setSenha]=useState("");

function login(){

signInWithEmailAndPassword(auth,email,senha)
.then(()=>{
navigation.navigate("Menu")
})
.catch(()=>{
alert("Erro no login")
})

}

return(

<View>

<Text>Delícias do Mar</Text>

<TextInput
placeholder="Email"
onChangeText={setEmail}
/>

<TextInput
placeholder="Senha"
secureTextEntry
onChangeText={setSenha}
/>

<Button title="Entrar" onPress={login}/>

</View>

)

}

screens/MenuScreen.js

import React from "react";
import {View,Text,FlatList,Button} from "react-native";
import {menu} from "../data/menu";

export default function MenuScreen(){

function pedir(item){

alert("Pedido enviado: "+item.nome)

}

return(

<View>

<Text>Cardápio Delícias do Mar</Text>

<FlatList
data={menu}
renderItem={({item})=>(
<View>

<Text>{item.nome}</Text>
<Text>R$ {item.preco}</Text>

<Button
title="Pedir"
onPress={()=>pedir(item)}
/>

</View>
)}
/>

</View>

)

}

screens/ManagerScreen.js

import React from "react";
import {View,Text} from "react-native";

export default function ManagerScreen(){

return(

<View>

<Text>Painel do Gerente</Text>

<Text>Relatório de vendas</Text>
<Text>Controle de garçons</Text>
<Text>Histórico de pedidos</Text>

</View>

)

}

const colors = {

marromEscuro:"#2B1A10",
marromMedio:"#4A2F1B",
marromClaro:"#6B4528",

dourado:"#E6B15C",
douradoClaro:"#F2C97D",
douradoQueimado:"#C8923F"

}

npx expo start

npx expo build:android

npx expo build:ios