import React, { Component } from 'react';
import {
  Container,
  Box,
  Heading,
  TextField,
  Text,
  Modal,
  Spinner,
  Button
} from 'gestalt';
import {
  Elements,
  StripeProvider,
  CardElement,
  injectStripe
} from 'react-stripe-elements';
import ToastMessage from './ToastMessage';
import { withRouter } from 'react-router-dom';
import { calculatePrice, getCart, clearCart, calculateAmount } from '../utils';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class _CheckoutForm extends Component {
  state = {
    toast: false,
    toastMessage: '',
    address: '',
    city: '',
    stateAbbreviation: '',
    postalCode: '',
    confirmationEmailAddress: '',
    cartItems: [],
    orderProcessing: false,
    modal: false
  };

  componentDidMount() {
    this.setState({
      cartItems: getCart()
    });
  }

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleConfirmOrder = event => {
    event.preventDefault();

    if (this.isFormEmpty(this.state)) {
      this.showToast('Please fill in all fields.');
      return;
    }

    this.setState({ modal: true });
  };

  handleSubmitOrder = async () => {
    const {
      cartItems,
      city,
      address,
      postalCode,
      stateAbbreviation
    } = this.state;

    const amount = calculateAmount(cartItems);
    // PROCESS ORDER
    this.setState({
      orderProcessing: true
    });

    let token;

    try {
      const response = await this.props.stripe.createToken();
      token = response.token.id;
      await strapi.createEntry('orders', {
        amount,
        brews: cartItems,
        city,
        postalCode,
        stateAbbreviation,
        address,
        token
      });
      this.setState({
        orderProcessing: false,
        modal: false
      });
      clearCart();
      this.showToast('Your order has been successfully submitted!', true);
    } catch (err) {
      this.setState({
        orderProcessing: false,
        modal: false
      });
      this.showToast(err.message);
      console.error(err);
    }
  };

  isFormEmpty = ({
    address,
    postalCode,
    city,
    confirmationEmailAddress,
    stateAbbreviation
  }) => {
    return (
      !address ||
      !postalCode ||
      !city ||
      !confirmationEmailAddress ||
      !stateAbbreviation
    );
  };

  showToast = (toastMessage, redirect = false) => {
    this.setState({
      toast: true,
      toastMessage
    });
    setTimeout(
      () =>
        this.setState(
          { toast: false, toastMessage: '' },
          () => redirect && this.props.history.push('/')
        ),
      5000
    );
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    const {
      toastMessage,
      toast,
      cartItems,
      modal,
      orderProcessing
    } = this.state;
    return (
      <Container>
        <Box
          color="darkWash"
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Heading color="midnight">Checkout</Heading>
          {/* User Cart */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            direction="column"
            marginTop={2}
            marginBottom={6}
          >
            {cartItems.length > 0 && (
              <Text color="darkGray" italic>
                {cartItems.length}
                {cartItems.length === 1 ? ' item' : ' items'} in cart
              </Text>
            )}
            <Box padding={2}>
              {cartItems.map(item => (
                <Box key={item._id} padding={1}>
                  <Text color="midnight" align="right">
                    {item.name} x {item.quantity} - $
                    {item.quantity * item.price}
                  </Text>
                </Box>
              ))}
              <hr />
            </Box>

            <Text bold>Total: {calculatePrice(cartItems)}</Text>
          </Box>
          {/* Checkout Form */}
          {cartItems.length > 0 ? (
            <form
              onSubmit={this.handleConfirmOrder}
              style={{
                display: 'inlineBlock',
                textAlign: 'center',
                maxWidth: 450
              }}
            >
              {/* SHIPPING ADDRESS */}
              <TextField
                id="address"
                type="text"
                name="address"
                placeholder="Shipping Address..."
                onChange={this.handleChange}
              />
              {/* POSTAL CODE */}
              <TextField
                id="postalCode"
                type="text"
                name="postalCode"
                placeholder="Postal Code..."
                onChange={this.handleChange}
              />
              {/* CITY */}
              <TextField
                id="city"
                type="text"
                name="city"
                placeholder="City..."
                onChange={this.handleChange}
              />
              {/* State */}
              <TextField
                id="stateAbbreviation"
                type="text"
                name="stateAbbreviation"
                placeholder="State Abbreviation (2 Characters)..."
                onChange={this.handleChange}
              />
              {/* confirmationEmailAddress */}
              <TextField
                id="confirmationEmailAddress"
                type="email"
                name="confirmationEmailAddress"
                placeholder="Confirmation Email Address..."
                onChange={this.handleChange}
              />
              {/* CARD PAYMENT FORM */}
              <CardElement
                id="stripe__input"
                onReady={input => input.focus()}
              />
              <button id="stripe__buttton" type="submit">
                Submit
              </button>
            </form>
          ) : (
            <Text bold>Add some items to your cart!</Text>
          )}
        </Box>
        {/* CONFIRMATION MODAL */}
        {modal && (
          <ConfirmationModal
            orderProcessing={orderProcessing}
            cartItems={cartItems}
            closeModal={this.closeModal}
            handleSubmitOrder={this.handleSubmitOrder}
          />
        )}
        <ToastMessage show={toast} message={toastMessage} />
      </Container>
    );
  }
}

const ConfirmationModal = ({
  orderProcessing,
  cartItems,
  closeModal,
  handleSubmitOrder
}) => (
  <Modal
    accessibilityCloseLabel="close"
    accessibilityModalLabel="Confirm your order"
    heading="Confirm your order"
    onDismiss={closeModal}
    footer={
      <Box
        display="flex"
        marginRight={-1}
        marginLeft={-1}
        justifyContent="center"
      >
        <Box padding={1}>
          <Button
            size="lg"
            color="red"
            text="Submit"
            disabled={orderProcessing}
            onClick={handleSubmitOrder}
          />
        </Box>
        <Box padding={1}>
          <Button
            size="lg"
            text="Cancel"
            disabled={orderProcessing}
            onClick={closeModal}
          />
        </Box>
      </Box>
    }
    role="alertdialog"
    size="sm"
  >
    {/* Order Summary */}
    {!orderProcessing && (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        direction="column"
        padding={2}
        color="lightWash"
      >
        {cartItems.map(item => (
          <Box key={item._id} padding={1}>
            <Text size="lg" color="red">
              {item.name} x {item.quantity} - ${item.quantity * item.price}
            </Text>
          </Box>
        ))}
        <Box paddingY={2}>
          <Text bold size="lg">
            Total: {calculatePrice(cartItems)}
          </Text>
        </Box>
      </Box>
    )}
    {/* Order Processing Spiner */}
    <Spinner
      show={orderProcessing}
      accessibilityLabel="Order Processing Spinner"
    />
    {orderProcessing && (
      <Text align="center" italic>
        Processing order...
      </Text>
    )}
  </Modal>
);

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => (
  <StripeProvider apiKey="pk_test_3epmAEPfjvBzlWnKqZiQQwZP">
    <Elements>
      <CheckoutForm />
    </Elements>
  </StripeProvider>
);

export default Checkout;
