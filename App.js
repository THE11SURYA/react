
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {View,Text,TextInput,FlatList,Image,StyleSheet,ActivityIndicator,TouchableOpacity} from 'react-native';

const Stack = createStackNavigator();

const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
 const api='https://dummy-json-api.com/products'
  useEffect(() => {
    fetch(api)
    .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [api]);

  const Search = (text) => {
    setSearch(text);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="green" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="enter item to search "
        value={search}
        onChangeText={Search}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productItem}
            onPress={() => navigation.navigate('Product Detail', { product: item })}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;
//here I assume that the APi will have the image for product  
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
      <Text style={styles.availability}>${product.availability}</Text>
      <Text>{product.description}</Text>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Product List" component={ProductListScreen} />
        <Stack.Screen name="Product Detail" component={ProductDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    margin: 10,
    paddingLeft: 8,
  },
  productItem: {
    flexDirection: 'row',
    padding: 10,

  },
  productImage: {
    width: 50,
    height: 50,
    margin: 10,
  },
  productName: {
    fontSize: 15,
  },
  productPrice: {
    fontSize: 16,
    color: 'rgb(0,100,100)',
  },
  availability:{
    fontSize: 16,
    color: 'rgb(0,100,100)'
  },
  productImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  productName: {
    fontSize: 24,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    color: 'gray',
    marginBottom: 10,
  },
});

export default App;
