import React, { Component } from 'react';
import {
  Container,
  Box,
  Heading,
  Card,
  Image,
  Text,
  SearchField,
  Icon
} from 'gestalt';
import { Link } from 'react-router-dom';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';
import Loader from './Loader';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    searchTerm: '',
    loadingBrands: true
  };

  async componentDidMount() {
    try {
      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: `query {
            brands {
              _id
              name
              description
              image {
                url
              }
            }
          }`
        }
      });
      this.setState({
        brands: response.data.brands,
        loadingBrands: false
      });
    } catch (err) {
      console.error(err);
      this.setState({
        loadingBrands: false
      });
    }
  }

  handleChange = ({ value }) => {
    this.setState(
      {
        searchTerm: value
      },
      () => this.searchBrands()
    );
  };

  // filterBrands = ({ searchTerm, brands }) => {
  //   return brands.filter(brand => {
  //     return (
  //       brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   });
  // };

  searchBrands = async () => {
    const response = await strapi.request('POST', '/graphql', {
      data: {
        query: `query {
          brands(where: {
            name_contains: "${this.state.searchTerm}"
          }) {
            _id
              name
              description
              image {
                url
              }
          }
        }`
      }
    });
    this.setState({
      brands: response.data.brands,
      loadingBrands: false
    });
  };

  render() {
    const { searchTerm, loadingBrands, brands } = this.state;
    return (
      <Container>
        {/* Brand Search Field */}
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            id="searchField"
            accessibilityLabel="Brands Search Field"
            onChange={this.handleChange}
            placeholder="Search Brands..."
            value={searchTerm}
          />
          <Box margin={2}>
            <Icon
              icon="filter"
              color={searchTerm ? 'orange' : 'gray'}
              size={20}
              accessibilityLabel="Filter"
            />
          </Box>
        </Box>

        {/* BRANDS SECTION */}
        <Box display="flex" justifyContent="center" margin={2}>
          {/* BRANDS HEADER */}
          <Heading color="navy" size="md">
            Brew Brands
          </Heading>
        </Box>
        {/* BRANDS */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: '#e3780c'
            }
          }}
          shape="square"
          wrap
          display="flex"
          justifyContent="around"
        >
          {brands.map(brand => (
            <Link to={`/${brand._id}`}>
              <Box paddingY={4} margin={2} width={200} key={brand._id}>
                <Card
                  image={
                    <Box height={200} width={200}>
                      <Image
                        fit="cover"
                        alt="Brand"
                        naturalHeight={1}
                        naturalWidth={1}
                        src={`${apiUrl}${brand.image.url}`}
                      />
                    </Box>
                  }
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                  >
                    <Text bold size="xl">
                      {brand.name}
                    </Text>
                    <Text>{brand.description}</Text>
                    <Text bold size="xl">
                      See Brews
                    </Text>
                  </Box>
                </Card>
              </Box>
            </Link>
          ))}
        </Box>
        <Loader show={loadingBrands} />
      </Container>
    );
  }
}

export default App;
