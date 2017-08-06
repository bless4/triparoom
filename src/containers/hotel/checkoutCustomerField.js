import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { checkoutOrder } from '../../actions/actionOrderHotel';
import { bindActionCreators } from 'redux';
import { TIKET_ROOT_URL } from '../../../config/api';
import { ALLOWED_PAYMENT_TYPE, ONSITE_PAYMENT_PROCESS } from '../../../config/payment';

class CheckoutCustomerField extends Component {
  constructor(props) {
    super(props);
  }

  renderPaymentOptions() {
    let x = 0;
    return _.map(this.props.order.payment_method_options, opt => {
      x++;
      if(opt.link != '#' && _.indexOf(ALLOWED_PAYMENT_TYPE, opt.type) != -1) {
        return (
          <label key={x} className="radio-inline padding-bottom-15 padding-right-10">
            <Field name="payment_method" component="input" required type="radio" value={opt.link}/>
            {opt.text}
          </label>
        );
      }
    });
  }

  renderTextField(field) {
    return (
      <div className="form-group">
        <input
          required
          type="{field.type}"
          name={field.name}
          className="form-control"
          placeholder={field.placeholder}
          {...field.input}
        />
      </div>
    );
  }

  onSubmitCheckout(values) {
    const token = localStorage.tiketToken;

    const url = (values.payment_method.indexOf("?") != -1) ? `${values.payment_method}&checkouttoken=${token}` : '/process-payment';
    const order_detail_id = this.props.order.order_detail_id;
    const order_id = this.props.order.order_id;

    this.props.checkoutOrder(values, order_detail_id, order_id, () => {
      window.location.href = url;
    });
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit(this.onSubmitCheckout.bind(this))}>
          <div className="booking_detail white-box animate-reveal">
            <h4>Personal information</h4>
            <div className="row">
                <div className="col-md-6">
                  <Field name="salute" className="select_booking" component="select">
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Mr">Ms</option>
                  </Field>
                </div>
                <div className="col-md-6">
                  <Field
                    name="first_name"
                    type="text"
                    placeholder="Enter Guest First Name..."
                    component={this.renderTextField}
                  />
                </div>
                <div className="col-md-6">
                  <Field
                    name="last_name"
                    type="text"
                    placeholder="Enter Guest Last Name..."
                    component={this.renderTextField}
                  />
                </div>
                <div className="col-md-6">
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter Guest Email Address..."
                    component={this.renderTextField}
                  />
                </div>
                <div className="col-md-6">
                  <Field
                    name="phone"
                    type="text"
                    placeholder="Enter Guest Phone Number..."
                    component={this.renderTextField}
                  />
                </div>
            </div>
          </div>
          <div className="booking_detail white-box animate-reveal">
            <h4>Payment Information</h4>
            <div className="col-md-12">
            </div>
            <div className="row">
              <div className="col-md-12">
                {this.renderPaymentOptions()}
              </div>
              <div className="col-md-12">
                <label>You will be redirected to Tiket.com payment page</label>
              </div>
              <div className="col-md-12">
                <p><button className="btn_book" type="submit">Confirm Booking</button></p>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ checkoutOrder }, dispatch);
}

export default reduxForm({
  form: 'Checkout'
}) (
    connect(null, mapDispatchToProps) (CheckoutCustomerField)
);
