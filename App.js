import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();

const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  //const api = 'https://dummy-json-api.com/products';

  useEffect(() => {
    fetch('https://dummy-json-api.com/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products);
        setFilteredProducts(data.products);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(text.toLowerCase())
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
        placeholder="Enter item to search"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productItem}
            onPress={() => navigation.navigate('Product Detail', { product: item })}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
            <View>
              <Text style={styles.productName}>{item.title}</Text>
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
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.thumbnail }} style={styles.productImageLarge} />
      <Text style={styles.productName}>{product.title}</Text>
      <Text style={styles.productPrice}>${product.price}</Text>
      
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
  
  productImageLarge: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  productNameLarge: {
    fontSize: 24,
    marginBottom: 10,
  },
  productPriceLarge: {
    fontSize: 20,
    color: 'gray',
    marginBottom: 10,
  },
});

export default App;
