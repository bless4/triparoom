import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { sortHotelList, clearHotelSearch, fetchHotelList } from '../../../actions/actionHotel';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';

const DAY_FORMAT = 'YYYY-MM-DD';

class HotelSearchField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      star: null,
      checkout_date: moment(props.params.start).add(props.params.night, 'days').format(DAY_FORMAT),
      night: 0,
      startdate: ''
    }

    this.renderDateField = this.renderDateField.bind(this);
  }

  componentDidMount() {
    this.handleInitialize();
  }

  handleInitialize() {
    let params = this.props.params;

    const initData = {
      "keyword": params.keyword,
      "checkin_date": params.start,
      "checkout_date": moment(params.start).add(params.night, 'days').format(DAY_FORMAT),
      "night": params.night,
      "room": params.room,
      "adult": params.adult
    };

    this.props.initialize(initData);
  }

  renderTextField(field) {
    return (
      <div className="form-group">
        <label>{field.label}</label>
        <input
          required
          type="text"
          name={field.name}
          className="form-control flight-input"
          placeholder={field.placeholder}
          {...field.input}
        />
      </div>
    );
  }

  renderDateField(field) {
    let now = new Date();
    let props = {
      disabledDays: {
        before: now,
        after: new Date( now.getTime() + 24 * 60 * 60 * 1000 * 547)  //547 is maximum date
      },
      onDayClick: (field) => {
        let night = (this.state.night == 0) ? this.props.queries.night : this.state.night;
        this.setState({
          startdate: moment(field).format(DAY_FORMAT),
          checkout_date: moment(field).add(night, 'days').format(DAY_FORMAT)
        });
      }
    }

    return (
      <div className="form-group">
        <label>{field.label}</label>
        <DayPickerInput
          required
          placeholder={field.placeholder}
          className="form-control flight-input"
          format={DAY_FORMAT}
          name={field.name}
          dayPickerProps={props}
          {...field.input}
        />
      </div>
    );
  }

  onSubmitSearch(values) {
    this.props.clearHotelSearch();
    let star = (values.star) ? values.star : 0
    let price = getPriceRange(values.price);
    let params = {
      keyword: values.keyword,
      start: values.checkin_date,
      night: values.night,
      room: values.room,
      adult: values.adult,
    }
    this.props.fetchHotelList(params, star, price.min, price.max);
  }

  handleChangeNight(event) {
    let startdate = (this.state.startdate == '') ? this.props.queries.startdate : this.state.startdate;
    this.setState({
      night: event.target.value,
      checkout_date: moment(startdate).add(event.target.value, 'days').format(DAY_FORMAT)
    });
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="form-detail-sidebar  animate-reveal">
        <h4>Pencarian Hotel</h4>
          <form onSubmit={handleSubmit(this.onSubmitSearch.bind(this))}>
            <Field
              label="Kata Pencarian"
              name="keyword"
              placeholder="Masukkan nama hotel atau lokasi tujuan"
              component={this.renderTextField}
            />

            <Field
              label="Tanggal Checkin"
              name="checkin_date"
              placeholder="Tanggal Check In"
              component={this.renderDateField}
            />

            <div className="form-group">
              <label>Lama Menginap</label>
              <Field
                name="night"
                required
                className="form-control"
                component="select"
                onChange={this.handleChangeNight.bind(this)}
              >
                <option value="1">1 Malam</option>
                <option value="2">2 Malam</option>
                <option value="3">3 Malam</option>
                <option value="4">4 Malam</option>
                <option value="5">5 Malam</option>
                <option value="6">6 Malam</option>
                <option value="7">7 Malam</option>
                <option value="8">8 Malam</option>
                <option value="9">9 Malam</option>
                <option value="10">10 Malam</option>
                <option value="11">11 Malam</option>
                <option value="12">12 Malam</option>
                <option value="13">13 Malam</option>
                <option value="14">14 Malam</option>
                <option value="15">15 Malam</option>
              </Field>
            </div>

            <div className="form-group">
              <label>Tanggal Check Out</label>
              <input
                value={this.state.checkout_date}
                disabled
                type="text"
                className="form-control flight-input"
              />
            </div>

            <div className="form-group">
              <label>Jumlah Kamar</label>
              <Field
                name="room"
                required
                className="form-control"
                component="select"
                onChange={this.setCheckoutDate}
              >
                <option value="1">1 Kamar</option>
                <option value="2">2 Kamar</option>
                <option value="3">3 Kamar</option>
                <option value="4">4 Kamar</option>
                <option value="5">5 Kamar</option>
                <option value="6">6 Kamar</option>
                <option value="7">7 Kamar</option>
                <option value="8">8 Kamar</option>
              </Field>
            </div>

            <div className="form-group">
              <label>Jumlah Tamu</label>
              <Field
                name="adult"
                required
                className="form-control"
                component="select"
              >
                <option value="1">1 Dewasa</option>
                <option value="2">2 Dewasa</option>
                <option value="3">3 Dewasa</option>
                <option value="4">4 Dewasa</option>
                <option value="5">5 Dewasa</option>
                <option value="6">6 Dewasa</option>
                <option value="7">7 Dewasa</option>
                <option value="8">8 Dewasa</option>
              </Field>
            </div>

            <div className="form-group">
              <label>Bintang Hotel</label>
              <Field name="star" className="form-control" component="select">
                <option value="0">Semua Bintang</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </Field>
            </div>

            <div className="form-group">
              <label>Harga</label>
              <Field name="price" className="form-control" component="select">
                <option value="0">Semua Harga</option>
                <option value="1"> 0 - 500,000</option>
                <option value="2">500,000 - 1,000,000</option>
                <option value="3">1,000,000 - 1,500,000</option>
                <option value="4">1,500,000 - 2,000,000</option>
                <option value="5">> 2,000,000</option>
              </Field>
            </div>
            <button type="submit" className="btn btn-search-travel btn-block">CARI</button>
          </form>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return { hotel: state.hotel }
}

function getPriceRange (price){
  switch(price) {
    case '1':
      return {min:0, max:500000};
    case '2':
      return {min:500000, max:1000000};
    case '3':
      return {min:1000000, max:1500000};
    case '4':
      return {min:1500000, max:2000000};
    case '5':
      return {min:2000000, max:20000000};
    default:
      return {min:0, max:20000000};
  }
}

export default reduxForm({
  form: 'SearchHotel'
}) (
    connect(mapStateToProps, { sortHotelList, clearHotelSearch, fetchHotelList }) (HotelSearchField)
);
