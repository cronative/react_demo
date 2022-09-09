import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Text, TextInput, View, ScrollView, KeyboardAvoidingView, } from 'react-native';
import CheckBox from 'react-native-check-box';
import { Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-number-input';
import { Get, Post, Put } from '../../api/apiAgent';
import commonStyle from '../../assets/css/mainStyle';
import global from '../../components/commonservices/toast';
import { CheckedBox, CheckedOrange, UncheckedBox } from '../../components/icons';
import { EMAIL_PATTERN } from '../../utility/commonRegex';
import { getCurrentCountryCode } from '../../utility/commonService';
import {
  profileViewRequest,
  profileViewRequestClear,
} from '../../store/actions/profileAction';
import { useDispatch, useSelector } from 'react-redux';
import { setupProgressionUpdate } from '../../store/actions';

const BusinessContacts = ({
  isUpdate,
  setLoader,
  redirectUrlHandler,
  userDetail,
  progressionData,
}) => {
  console.log(userDetail);
  const dispatch = useDispatch();
  const [isPhoneNumberChecked, setIsPhoneNumberChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [mobile, setMobile] = useState('');
  const [callingCode, setCallingCode] = useState('+1');
  const [countryCode, setCountryCode] = useState('US');
  const [formattedValue, setFormattedValue] = useState('');
  const phoneInput = useRef('');
  const [isEmailFocus, setIsEmailFocus] = useState(false);
  const [email, setEmail] = useState('');
  const [isUpdatedData, setIsUpdatedData] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(null);
  const [ready, setReady] = useState(false);
  const [objCountries, setObjCountries] = useState(
    [
      {
        "name": "Afghanistan",
        "dial_code": "93",
        "code": "AF"
      },
      {
        "name": "Aland Islands",
        "dial_code": "358",
        "code": "AX"
      },
      {
        "name": "Albania",
        "dial_code": "355",
        "code": "AL"
      }, {
        "name": "United States",
        "dial_code": "1",
        "code": "US"
      },
      {
        "name": "Algeria",
        "dial_code": "213",
        "code": "DZ"
      },
      {
        "name": "AmericanSamoa",
        "dial_code": "1684",
        "code": "AS"
      },
      {
        "name": "Andorra",
        "dial_code": "376",
        "code": "AD"
      },
      {
        "name": "Angola",
        "dial_code": "244",
        "code": "AO"
      },
      {
        "name": "Anguilla",
        "dial_code": "1264",
        "code": "AI"
      },
      {
        "name": "Antarctica",
        "dial_code": "672",
        "code": "AQ"
      },
      {
        "name": "Antigua and Barbuda",
        "dial_code": "1268",
        "code": "AG"
      },
      {
        "name": "Argentina",
        "dial_code": "54",
        "code": "AR"
      },
      {
        "name": "Armenia",
        "dial_code": "374",
        "code": "AM"
      },
      {
        "name": "Aruba",
        "dial_code": "297",
        "code": "AW"
      },
      {
        "name": "Australia",
        "dial_code": "61",
        "code": "AU"
      },
      {
        "name": "Austria",
        "dial_code": "43",
        "code": "AT"
      },
      {
        "name": "Azerbaijan",
        "dial_code": "994",
        "code": "AZ"
      },
      {
        "name": "Bahamas",
        "dial_code": "1242",
        "code": "BS"
      },
      {
        "name": "Bahrain",
        "dial_code": "973",
        "code": "BH"
      },
      {
        "name": "Bangladesh",
        "dial_code": "880",
        "code": "BD"
      },
      {
        "name": "Barbados",
        "dial_code": "1246",
        "code": "BB"
      },
      {
        "name": "Belarus",
        "dial_code": "375",
        "code": "BY"
      },
      {
        "name": "Belgium",
        "dial_code": "32",
        "code": "BE"
      },
      {
        "name": "Belize",
        "dial_code": "501",
        "code": "BZ"
      },
      {
        "name": "Benin",
        "dial_code": "229",
        "code": "BJ"
      },
      {
        "name": "Bermuda",
        "dial_code": "1441",
        "code": "BM"
      },
      {
        "name": "Bhutan",
        "dial_code": "975",
        "code": "BT"
      },
      {
        "name": "Bolivia, Plurinational State of",
        "dial_code": "591",
        "code": "BO"
      },
      {
        "name": "Bosnia and Herzegovina",
        "dial_code": "387",
        "code": "BA"
      },
      {
        "name": "Botswana",
        "dial_code": "267",
        "code": "BW"
      },
      {
        "name": "Brazil",
        "dial_code": "55",
        "code": "BR"
      },
      {
        "name": "British Indian Ocean Territory",
        "dial_code": "246",
        "code": "IO"
      },
      {
        "name": "Brunei Darussalam",
        "dial_code": "673",
        "code": "BN"
      },
      {
        "name": "Bulgaria",
        "dial_code": "359",
        "code": "BG"
      },
      {
        "name": "Burkina Faso",
        "dial_code": "226",
        "code": "BF"
      },
      {
        "name": "Burundi",
        "dial_code": "257",
        "code": "BI"
      },
      {
        "name": "Cambodia",
        "dial_code": "855",
        "code": "KH"
      },
      {
        "name": "Cameroon",
        "dial_code": "237",
        "code": "CM"
      },
      {
        "name": "Canada",
        "dial_code": "1",
        "code": "CA"
      },
      {
        "name": "Cape Verde",
        "dial_code": "238",
        "code": "CV"
      },
      {
        "name": "Cayman Islands",
        "dial_code": " 345",
        "code": "KY"
      },
      {
        "name": "Central African Republic",
        "dial_code": "236",
        "code": "CF"
      },
      {
        "name": "Chad",
        "dial_code": "235",
        "code": "TD"
      },
      {
        "name": "Chile",
        "dial_code": "56",
        "code": "CL"
      },
      {
        "name": "China",
        "dial_code": "86",
        "code": "CN"
      },
      {
        "name": "Christmas Island",
        "dial_code": "61",
        "code": "CX"
      },
      {
        "name": "Cocos (Keeling) Islands",
        "dial_code": "61",
        "code": "CC"
      },
      {
        "name": "Colombia",
        "dial_code": "57",
        "code": "CO"
      },
      {
        "name": "Comoros",
        "dial_code": "269",
        "code": "KM"
      },
      {
        "name": "Congo",
        "dial_code": "242",
        "code": "CG"
      },
      {
        "name": "Congo, The Democratic Republic of the Congo",
        "dial_code": "243",
        "code": "CD"
      },
      {
        "name": "Cook Islands",
        "dial_code": "682",
        "code": "CK"
      },
      {
        "name": "Costa Rica",
        "dial_code": "506",
        "code": "CR"
      },
      {
        "name": "Cote d'Ivoire",
        "dial_code": "225",
        "code": "CI"
      },
      {
        "name": "Croatia",
        "dial_code": "385",
        "code": "HR"
      },
      {
        "name": "Cuba",
        "dial_code": "53",
        "code": "CU"
      },
      {
        "name": "Cyprus",
        "dial_code": "357",
        "code": "CY"
      },
      {
        "name": "Czech Republic",
        "dial_code": "420",
        "code": "CZ"
      },
      {
        "name": "Denmark",
        "dial_code": "45",
        "code": "DK"
      },
      {
        "name": "Djibouti",
        "dial_code": "253",
        "code": "DJ"
      },
      {
        "name": "Dominica",
        "dial_code": "1767",
        "code": "DM"
      },
      {
        "name": "Dominican Republic",
        "dial_code": "1849",
        "code": "DO"
      },
      {
        "name": "Ecuador",
        "dial_code": "593",
        "code": "EC"
      },
      {
        "name": "Egypt",
        "dial_code": "20",
        "code": "EG"
      },
      {
        "name": "El Salvador",
        "dial_code": "503",
        "code": "SV"
      },
      {
        "name": "Equatorial Guinea",
        "dial_code": "240",
        "code": "GQ"
      },
      {
        "name": "Eritrea",
        "dial_code": "291",
        "code": "ER"
      },
      {
        "name": "Estonia",
        "dial_code": "372",
        "code": "EE"
      },
      {
        "name": "Ethiopia",
        "dial_code": "251",
        "code": "ET"
      },
      {
        "name": "Falkland Islands (Malvinas)",
        "dial_code": "500",
        "code": "FK"
      },
      {
        "name": "Faroe Islands",
        "dial_code": "298",
        "code": "FO"
      },
      {
        "name": "Fiji",
        "dial_code": "679",
        "code": "FJ"
      },
      {
        "name": "Finland",
        "dial_code": "358",
        "code": "FI"
      },
      {
        "name": "France",
        "dial_code": "33",
        "code": "FR"
      },
      {
        "name": "French Guiana",
        "dial_code": "594",
        "code": "GF"
      },
      {
        "name": "French Polynesia",
        "dial_code": "689",
        "code": "PF"
      },
      {
        "name": "Gabon",
        "dial_code": "241",
        "code": "GA"
      },
      {
        "name": "Gambia",
        "dial_code": "220",
        "code": "GM"
      },
      {
        "name": "Georgia",
        "dial_code": "995",
        "code": "GE"
      },
      {
        "name": "Germany",
        "dial_code": "49",
        "code": "DE"
      },
      {
        "name": "Ghana",
        "dial_code": "233",
        "code": "GH"
      },
      {
        "name": "Gibraltar",
        "dial_code": "350",
        "code": "GI"
      },
      {
        "name": "Greece",
        "dial_code": "30",
        "code": "GR"
      },
      {
        "name": "Greenland",
        "dial_code": "299",
        "code": "GL"
      },
      {
        "name": "Grenada",
        "dial_code": "1473",
        "code": "GD"
      },
      {
        "name": "Guadeloupe",
        "dial_code": "590",
        "code": "GP"
      },
      {
        "name": "Guam",
        "dial_code": "1671",
        "code": "GU"
      },
      {
        "name": "Guatemala",
        "dial_code": "502",
        "code": "GT"
      },
      {
        "name": "Guernsey",
        "dial_code": "44",
        "code": "GG"
      },
      {
        "name": "Guinea",
        "dial_code": "224",
        "code": "GN"
      },
      {
        "name": "Guinea-Bissau",
        "dial_code": "245",
        "code": "GW"
      },
      {
        "name": "Guyana",
        "dial_code": "595",
        "code": "GY"
      },
      {
        "name": "Haiti",
        "dial_code": "509",
        "code": "HT"
      },
      {
        "name": "Holy See (Vatican City State)",
        "dial_code": "379",
        "code": "VA"
      },
      {
        "name": "Honduras",
        "dial_code": "504",
        "code": "HN"
      },
      {
        "name": "Hong Kong",
        "dial_code": "852",
        "code": "HK"
      },
      {
        "name": "Hungary",
        "dial_code": "36",
        "code": "HU"
      },
      {
        "name": "Iceland",
        "dial_code": "354",
        "code": "IS"
      },
      {
        "name": "India",
        "dial_code": "91",
        "code": "IN"
      },
      {
        "name": "Indonesia",
        "dial_code": "62",
        "code": "ID"
      },
      {
        "name": "Iran, Islamic Republic of Persian Gulf",
        "dial_code": "98",
        "code": "IR"
      },
      {
        "name": "Iraq",
        "dial_code": "964",
        "code": "IQ"
      },
      {
        "name": "Ireland",
        "dial_code": "353",
        "code": "IE"
      },
      {
        "name": "Isle of Man",
        "dial_code": "44",
        "code": "IM"
      },
      {
        "name": "Israel",
        "dial_code": "972",
        "code": "IL"
      },
      {
        "name": "Italy",
        "dial_code": "39",
        "code": "IT"
      },
      {
        "name": "Jamaica",
        "dial_code": "1876",
        "code": "JM"
      },
      {
        "name": "Japan",
        "dial_code": "81",
        "code": "JP"
      },
      {
        "name": "Jersey",
        "dial_code": "44",
        "code": "JE"
      },
      {
        "name": "Jordan",
        "dial_code": "962",
        "code": "JO"
      },
      {
        "name": "Kazakhstan",
        "dial_code": "77",
        "code": "KZ"
      },
      {
        "name": "Kenya",
        "dial_code": "254",
        "code": "KE"
      },
      {
        "name": "Kiribati",
        "dial_code": "686",
        "code": "KI"
      },
      {
        "name": "Korea, Democratic People's Republic of Korea",
        "dial_code": "850",
        "code": "KP"
      },
      {
        "name": "Korea, Republic of South Korea",
        "dial_code": "82",
        "code": "KR"
      },
      {
        "name": "Kuwait",
        "dial_code": "965",
        "code": "KW"
      },
      {
        "name": "Kyrgyzstan",
        "dial_code": "996",
        "code": "KG"
      },
      {
        "name": "Laos",
        "dial_code": "856",
        "code": "LA"
      },
      {
        "name": "Latvia",
        "dial_code": "371",
        "code": "LV"
      },
      {
        "name": "Lebanon",
        "dial_code": "961",
        "code": "LB"
      },
      {
        "name": "Lesotho",
        "dial_code": "266",
        "code": "LS"
      },
      {
        "name": "Liberia",
        "dial_code": "231",
        "code": "LR"
      },
      {
        "name": "Libyan Arab Jamahiriya",
        "dial_code": "218",
        "code": "LY"
      },
      {
        "name": "Liechtenstein",
        "dial_code": "423",
        "code": "LI"
      },
      {
        "name": "Lithuania",
        "dial_code": "370",
        "code": "LT"
      },
      {
        "name": "Luxembourg",
        "dial_code": "352",
        "code": "LU"
      },
      {
        "name": "Macao",
        "dial_code": "853",
        "code": "MO"
      },
      {
        "name": "Macedonia",
        "dial_code": "389",
        "code": "MK"
      },
      {
        "name": "Madagascar",
        "dial_code": "261",
        "code": "MG"
      },
      {
        "name": "Malawi",
        "dial_code": "265",
        "code": "MW"
      },
      {
        "name": "Malaysia",
        "dial_code": "60",
        "code": "MY"
      },
      {
        "name": "Maldives",
        "dial_code": "960",
        "code": "MV"
      },
      {
        "name": "Mali",
        "dial_code": "223",
        "code": "ML"
      },
      {
        "name": "Malta",
        "dial_code": "356",
        "code": "MT"
      },
      {
        "name": "Marshall Islands",
        "dial_code": "692",
        "code": "MH"
      },
      {
        "name": "Martinique",
        "dial_code": "596",
        "code": "MQ"
      },
      {
        "name": "Mauritania",
        "dial_code": "222",
        "code": "MR"
      },
      {
        "name": "Mauritius",
        "dial_code": "230",
        "code": "MU"
      },
      {
        "name": "Mayotte",
        "dial_code": "262",
        "code": "YT"
      },
      {
        "name": "Mexico",
        "dial_code": "52",
        "code": "MX"
      },
      {
        "name": "Micronesia, Federated States of Micronesia",
        "dial_code": "691",
        "code": "FM"
      },
      {
        "name": "Moldova",
        "dial_code": "373",
        "code": "MD"
      },
      {
        "name": "Monaco",
        "dial_code": "377",
        "code": "MC"
      },
      {
        "name": "Mongolia",
        "dial_code": "976",
        "code": "MN"
      },
      {
        "name": "Montenegro",
        "dial_code": "382",
        "code": "ME"
      },
      {
        "name": "Montserrat",
        "dial_code": "1664",
        "code": "MS"
      },
      {
        "name": "Morocco",
        "dial_code": "212",
        "code": "MA"
      },
      {
        "name": "Mozambique",
        "dial_code": "258",
        "code": "MZ"
      },
      {
        "name": "Myanmar",
        "dial_code": "95",
        "code": "MM"
      },
      {
        "name": "Namibia",
        "dial_code": "264",
        "code": "NA"
      },
      {
        "name": "Nauru",
        "dial_code": "674",
        "code": "NR"
      },
      {
        "name": "Nepal",
        "dial_code": "977",
        "code": "NP"
      },
      {
        "name": "Netherlands",
        "dial_code": "31",
        "code": "NL"
      },
      {
        "name": "Netherlands Antilles",
        "dial_code": "599",
        "code": "AN"
      },
      {
        "name": "New Caledonia",
        "dial_code": "687",
        "code": "NC"
      },
      {
        "name": "New Zealand",
        "dial_code": "64",
        "code": "NZ"
      },
      {
        "name": "Nicaragua",
        "dial_code": "505",
        "code": "NI"
      },
      {
        "name": "Niger",
        "dial_code": "227",
        "code": "NE"
      },
      {
        "name": "Nigeria",
        "dial_code": "234",
        "code": "NG"
      },
      {
        "name": "Niue",
        "dial_code": "683",
        "code": "NU"
      },
      {
        "name": "Norfolk Island",
        "dial_code": "672",
        "code": "NF"
      },
      {
        "name": "Northern Mariana Islands",
        "dial_code": "1670",
        "code": "MP"
      },
      {
        "name": "Norway",
        "dial_code": "47",
        "code": "NO"
      },
      {
        "name": "Oman",
        "dial_code": "968",
        "code": "OM"
      },
      {
        "name": "Pakistan",
        "dial_code": "92",
        "code": "PK"
      },
      {
        "name": "Palau",
        "dial_code": "680",
        "code": "PW"
      },
      {
        "name": "Palestinian Territory, Occupied",
        "dial_code": "970",
        "code": "PS"
      },
      {
        "name": "Panama",
        "dial_code": "507",
        "code": "PA"
      },
      {
        "name": "Papua New Guinea",
        "dial_code": "675",
        "code": "PG"
      },
      {
        "name": "Paraguay",
        "dial_code": "595",
        "code": "PY"
      },
      {
        "name": "Peru",
        "dial_code": "51",
        "code": "PE"
      },
      {
        "name": "Philippines",
        "dial_code": "63",
        "code": "PH"
      },
      {
        "name": "Pitcairn",
        "dial_code": "872",
        "code": "PN"
      },
      {
        "name": "Poland",
        "dial_code": "48",
        "code": "PL"
      },
      {
        "name": "Portugal",
        "dial_code": "351",
        "code": "PT"
      },
      {
        "name": "Puerto Rico",
        "dial_code": "1939",
        "code": "PR"
      },
      {
        "name": "Qatar",
        "dial_code": "974",
        "code": "QA"
      },
      {
        "name": "Romania",
        "dial_code": "40",
        "code": "RO"
      },
      {
        "name": "Russia",
        "dial_code": "7",
        "code": "RU"
      },
      {
        "name": "Rwanda",
        "dial_code": "250",
        "code": "RW"
      },
      {
        "name": "Reunion",
        "dial_code": "262",
        "code": "RE"
      },
      {
        "name": "Saint Barthelemy",
        "dial_code": "590",
        "code": "BL"
      },
      {
        "name": "Saint Helena, Ascension and Tristan Da Cunha",
        "dial_code": "290",
        "code": "SH"
      },
      {
        "name": "Saint Kitts and Nevis",
        "dial_code": "1869",
        "code": "KN"
      },
      {
        "name": "Saint Lucia",
        "dial_code": "1758",
        "code": "LC"
      },
      {
        "name": "Saint Martin",
        "dial_code": "590",
        "code": "MF"
      },
      {
        "name": "Saint Pierre and Miquelon",
        "dial_code": "508",
        "code": "PM"
      },
      {
        "name": "Saint Vincent and the Grenadines",
        "dial_code": "1784",
        "code": "VC"
      },
      {
        "name": "Samoa",
        "dial_code": "685",
        "code": "WS"
      },
      {
        "name": "San Marino",
        "dial_code": "378",
        "code": "SM"
      },
      {
        "name": "Sao Tome and Principe",
        "dial_code": "239",
        "code": "ST"
      },
      {
        "name": "Saudi Arabia",
        "dial_code": "966",
        "code": "SA"
      },
      {
        "name": "Senegal",
        "dial_code": "221",
        "code": "SN"
      },
      {
        "name": "Serbia",
        "dial_code": "381",
        "code": "RS"
      },
      {
        "name": "Seychelles",
        "dial_code": "248",
        "code": "SC"
      },
      {
        "name": "Sierra Leone",
        "dial_code": "232",
        "code": "SL"
      },
      {
        "name": "Singapore",
        "dial_code": "65",
        "code": "SG"
      },
      {
        "name": "Slovakia",
        "dial_code": "421",
        "code": "SK"
      },
      {
        "name": "Slovenia",
        "dial_code": "386",
        "code": "SI"
      },
      {
        "name": "Solomon Islands",
        "dial_code": "677",
        "code": "SB"
      },
      {
        "name": "Somalia",
        "dial_code": "252",
        "code": "SO"
      },
      {
        "name": "South Africa",
        "dial_code": "27",
        "code": "ZA"
      },
      {
        "name": "South Sudan",
        "dial_code": "211",
        "code": "SS"
      },
      {
        "name": "South Georgia and the South Sandwich Islands",
        "dial_code": "500",
        "code": "GS"
      },
      {
        "name": "Spain",
        "dial_code": "34",
        "code": "ES"
      },
      {
        "name": "Sri Lanka",
        "dial_code": "94",
        "code": "LK"
      },
      {
        "name": "Sudan",
        "dial_code": "249",
        "code": "SD"
      },
      {
        "name": "Suriname",
        "dial_code": "597",
        "code": "SR"
      },
      {
        "name": "Svalbard and Jan Mayen",
        "dial_code": "47",
        "code": "SJ"
      },
      {
        "name": "Swaziland",
        "dial_code": "268",
        "code": "SZ"
      },
      {
        "name": "Sweden",
        "dial_code": "46",
        "code": "SE"
      },
      {
        "name": "Switzerland",
        "dial_code": "41",
        "code": "CH"
      },
      {
        "name": "Syrian Arab Republic",
        "dial_code": "963",
        "code": "SY"
      },
      {
        "name": "Taiwan",
        "dial_code": "886",
        "code": "TW"
      },
      {
        "name": "Tajikistan",
        "dial_code": "992",
        "code": "TJ"
      },
      {
        "name": "Tanzania, United Republic of Tanzania",
        "dial_code": "255",
        "code": "TZ"
      },
      {
        "name": "Thailand",
        "dial_code": "66",
        "code": "TH"
      },
      {
        "name": "Timor-Leste",
        "dial_code": "670",
        "code": "TL"
      },
      {
        "name": "Togo",
        "dial_code": "228",
        "code": "TG"
      },
      {
        "name": "Tokelau",
        "dial_code": "690",
        "code": "TK"
      },
      {
        "name": "Tonga",
        "dial_code": "676",
        "code": "TO"
      },
      {
        "name": "Trinidad and Tobago",
        "dial_code": "1868",
        "code": "TT"
      },
      {
        "name": "Tunisia",
        "dial_code": "216",
        "code": "TN"
      },
      {
        "name": "Turkey",
        "dial_code": "90",
        "code": "TR"
      },
      {
        "name": "Turkmenistan",
        "dial_code": "993",
        "code": "TM"
      },
      {
        "name": "Turks and Caicos Islands",
        "dial_code": "1649",
        "code": "TC"
      },
      {
        "name": "Tuvalu",
        "dial_code": "688",
        "code": "TV"
      },
      {
        "name": "Uganda",
        "dial_code": "256",
        "code": "UG"
      },
      {
        "name": "Ukraine",
        "dial_code": "380",
        "code": "UA"
      },
      {
        "name": "United Arab Emirates",
        "dial_code": "971",
        "code": "AE"
      },
      {
        "name": "United Kingdom",
        "dial_code": "44",
        "code": "GB"
      },
      {
        "name": "Uruguay",
        "dial_code": "598",
        "code": "UY"
      },
      {
        "name": "Uzbekistan",
        "dial_code": "998",
        "code": "UZ"
      },
      {
        "name": "Vanuatu",
        "dial_code": "678",
        "code": "VU"
      },
      {
        "name": "Venezuela, Bolivarian Republic of Venezuela",
        "dial_code": "58",
        "code": "VE"
      },
      {
        "name": "Vietnam",
        "dial_code": "84",
        "code": "VN"
      },
      {
        "name": "Virgin Islands, British",
        "dial_code": "1284",
        "code": "VG"
      },
      {
        "name": "Virgin Islands, U.S.",
        "dial_code": "1340",
        "code": "VI"
      },
      {
        "name": "Wallis and Futuna",
        "dial_code": "681",
        "code": "WF"
      },
      {
        "name": "Yemen",
        "dial_code": "967",
        "code": "YE"
      },
      {
        "name": "Zambia",
        "dial_code": "260",
        "code": "ZM"
      },
      {
        "name": "Zimbabwe",
        "dial_code": "263",
        "code": "ZW"
      }
    ]);
  const profileData = useSelector(
    (state) => state.profileReducer.profileDetails,
  );
  //  let phone = await AsyncStorage.getItem('phone');

  const phoneNumberSelectHelper = () => {
    setReady(!ready)
    setIsPhoneNumberChecked(!isPhoneNumberChecked);
  };

  /**
   * This method will call on Current Location Select.
   */
  const emailSelectHelper = () => {
    setIsEmailChecked(!isEmailChecked);
  };

  const prefieldEmailPhone = async () => {
    try {
      //  let email = await AsyncStorage.getItem('email');
      //   let callingCode = await AsyncStorage.getItem('callingCode');
      //  const countryCode = phoneInput.current?.getCountryCode();
      //  console.log(countryCode);
      // setCountryCode(callingCode || '');
    } catch (e) { }
  };

  useEffect(() => {
    dispatch(profileViewRequest());
  }, []);

  // This methos is for handle the response
  useEffect(() => {
    if (profileData && profileData.status == 200) {
      setEmail(profileData.data.email);
      setMobile(profileData.data.phone);
      setCallingCode(profileData.data.countryCode);
      // if (
      //   profileData.data.countryCode === '91' ||
      //   profileData.data.countryCode === '+91'
      // ) {
      //   setCountryCode('IN');
      //   console.log('US');
      // } else if (
      //   profileData.data.countryCode === '1' ||
      //   profileData.data.countryCode === '+1'
      // ) {
      //   setCountryCode('US');
      //   console.log('US');
      // } else if (
      //   profileData.data.countryCode === '44' ||
      //   profileData.data.countryCode === '+44'
      // ) {
      //   setCountryCode('GB');
      //   console.log('GB');
      // } else {
      //   setCountryCode('US');
      // }
      setTimeout(() => {
        getContactDetails();
      }, 100);
      dispatch(profileViewRequestClear());
    } else {
      dispatch(profileViewRequestClear());
    }
  }, [profileData]);

  useEffect(() => {
    let userEmail = userDetail && userDetail.email ? userDetail.email : '';
    //phone
    let userCountryCode =
      userDetail && userDetail.countryCode ? userDetail.countryCode : '';
    console.log(countryCode);
    let userPhone = userDetail && userDetail.phone ? userDetail.phone : '';

    setEmail(userEmail);
    setMobile(userPhone);
    setCallingCode(userCountryCode);
    console.log("userCountryCode ______________ ", userCountryCode)
    let result = userCountryCode.replace("+", "");

    const objC = objCountries.filter((a) => { return a.dial_code == result });
    if (objC.length > 0) {
      console.log("objC>>> 1335   ", objC[0].code);
      setCountryCode(objC[0].code)
      // setCallingCode(objC[0].code)
    }
    // if (userCountryCode === '91' || userCountryCode === '+91') {
    //   setCountryCode('IN');
    //   console.log('US');
    // } else if (userCountryCode === '1' || userCountryCode === '+1') {
    //   setCountryCode('US');
    //   console.log('US');
    // } else if (userCountryCode === '44' || userCountryCode === '+44') {
    //   setCountryCode('GB');
    //   console.log('GB');
    // } else {
    //   setCountryCode('US');
    //   console.log('US');
    // }
    console.log(email, countryCode, mobile);
  }, [userDetail]);

  const contactHandler = () => {
    const payload = {
      isPhoneNoShare: isPhoneNumberChecked == false ? 0 : 1,
      inAppChatEnabled: 1,
      isEmailShare: isEmailChecked == false ? 0 : 1,
    };
    let flag = false;
    if (isEmailChecked) {
      payload.email = email;
      if (email) {
        if (EMAIL_PATTERN.test(email)) {
          flag = false;
        } else {
          flag = true;
          global.showToast('Invalid email', 'error');
          return false;
        }
      }
    }
    if (isPhoneNumberChecked) {
      payload.phoneNo = mobile;
      payload.countryCode = callingCode;
      if (mobile) {
        // if (mobile.length > 12) {
        //   flag = true;
        //   global.showToast('Invalid phone number', 'error');
        //   return false;
        // } else if (mobile.length < 10) {
        //   flag = true;
        //   global.showToast('Invalid phone number', 'error');
        //   return false;
        // } else {
        //   flag = false;
        // }
      }
    }
    //validation code
    if (flag === false) {
      proContactInformationUpdate(payload);
    }
  };


  const skipBtnHanler = () => {
    console.log('***');
    setLoader(true);
    Put('pro/skip-step', { contact: '1' })
      .then((result) => {
        setLoader(false);
        console.log('result is **', result);
        // navigation.navigate(nextStep ? nextStep : 'SetupTermsOfPayment');
      })
      .catch((error) => {
        console.log('error', error);
        setLoader(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };

  const proContactInformationUpdate = (data) => {
    console.log('Data : ', data);
    setLoader(true);
    console.log('isUpdatedData', isUpdatedData);
    skipBtnHanler();
    if (!isUpdatedData) {
      Post('pro/add-contact-prefs', data)
        .then((result) => {
          setLoader(false);
          if (result.status === 201) {
            if (!!progressionData) {
              const updatedProgression = progressionData.map((step) => {
                if (step.stepNo === 7) {
                  return { ...step, isCompleted: 1 };
                }
                return step;
              });

              dispatch(setupProgressionUpdate(updatedProgression));
            }
            global.showToast(result.message, 'success');
            redirectUrlHandler();
          } else {
            global.showToast(result.message, 'error');
          }
        })
        .catch((error) => {
          setLoader(false);
          global.showToast(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            'Something went wrong',
            'error',
          );
        });
    } else {
      Put('pro/contact-pref', data)
        .then((result) => {
          setLoader(false);
          if (result.status === 200) {
            global.showToast(result.message, 'success');
            redirectUrlHandler();
          } else {
            global.showToast(result.message, 'error');
          }
        })
        .catch((error) => {
          setLoader(false);
          global.showToast(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            'Something went wrong',
            'error',
          );
        });
    }


  };

  const getContactDetails = () => {
    setLoader(true);
    Get('pro/contact-pref', '')
      .then((result) => {
        console.log('New Data : ', result.data);
        setLoader(false);
        if (
          result.status === 200 &&
          result.data &&
          (result.data.email || result.data.phoneNumber)
        ) {
          console.log('in');
          setIsUpdatedData(true);
          let userContactDetails = result.data;
          console.log('Details : ', userContactDetails);
          if (userContactDetails.IsEmailShare && userContactDetails.email) {
            setIsEmailChecked(true);
            setEmail(userContactDetails.email);
          }
          if (
            userContactDetails.isPhoneNOShare &&
            userContactDetails.phoneNumber
          ) {
            setMobile(userContactDetails.phoneNumber);
            setIsPhoneNumberChecked(true);
          }

          if (userContactDetails.isPhoneNOShare != 0) {
            let ctryCode = userContactDetails.countryCode;
            console.log("ctryCode ", ctryCode);
            let result = ctryCode.replace("+", "");
            const objC = objCountries.filter((a) => { return a.dial_code == result });
            if (objC.length > 0) {
              console.log("objC>>> ", objC[0].code);
              setCountryCode(objC[0].code)
              setReady(true)
              // setCallingCode(objC[0].code)
            }


            // setCallingCode(ctryCode)
            // if (ctryCode === '91' || ctryCode === '+91') {
            //   setCountryCode('IN');
            //   setCallingCode('+91');
            // } else if (ctryCode === '1' || ctryCode === '+1') {
            //   setCountryCode('US');
            //   setCallingCode('+1');
            // } else if (ctryCode === '44' || ctryCode === '+44') {
            //   setCountryCode('GB');
            //   setCallingCode('+44');
            //   console.log("ctryCode ", countryCode);
            //   console.log("ctryCode11 ", callingCode);
            // } else {
            //   setCountryCode('US');
            //   setCallingCode('+1');
            // }
          } else {
            console.log("&&&&&&&&&&&&&&&&&&&&&")
            setCountryCode('US');
            setCallingCode('+1');
          }
        } else {
          console.log('out');
          prefieldEmailPhone();
        }
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  const validateEmail = () => {
    console.log('email', email);
    if (email) {
      if (EMAIL_PATTERN.test(email)) {
        setIsValidEmail(null);
      } else {
        setIsValidEmail('Not a valid email');
      }
    } else {
      setIsValidEmail('Required');
    }
  };

  return (
    <Fragment>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? 80 : 0}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {console.log(
            mobile,
            countryCode,
            callingCode,
            email,
            getCurrentCountryCode(),
          )}

          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={[commonStyle.fromwrap, commonStyle.mt1]}>
              <Text style={[commonStyle.subheading, commonStyle.mb1]}>
                Contact details preferences
              </Text>
            </View>
            <View style={commonStyle.categoriseListWrap}>
              <View style={[commonStyle.setupCardBox]}>
                <View style={commonStyle.appchatWrap}>
                  <Text style={commonStyle.blackTextR}>In-App chat</Text>
                  <CheckedOrange />
                </View>
                <View style={[commonStyle.contactDetailscheck]}>
                  <CheckBox
                    style={{ paddingVertical: 10 }}
                    onClick={() => phoneNumberSelectHelper()}
                    isChecked={isPhoneNumberChecked}
                    checkedCheckBoxColor={'#ff5f22'}
                    uncheckedCheckBoxColor={'#e6e7e8'}
                    leftText={'Phone number'}
                    leftTextStyle={commonStyle.blackTextR}
                    checkedImage={<CheckedBox />}
                    unCheckedImage={<UncheckedBox />}
                  />
                  {isPhoneNumberChecked == 1 && ready ? (

                    <View style={[commonStyle.mt1, commonStyle.mb1]}>
                      <PhoneInput
                        ref={phoneInput}
                        defaultValue={mobile ? mobile : ''}
                        defaultCode={countryCode}
                        value={mobile}
                        layout="first"
                        maxLength={10}
                        placeholder="XXXX XXX XXX"
                        onChangeCountry={country => console.log(country)}
                        onChangeText={(text) => {
                          setMobile(text?.replace(/[^0-9]/gi, ''));
                        }}
                        onChangeFormattedText={(text) => {
                          setFormattedValue(text);
                          setCallingCode(
                            phoneInput.current?.getCallingCode() || '',
                          );
                        }}
                        withDarkTheme={false}
                        withShadow={false}
                        autoFocus={false}
                        containerStyle={[
                          commonStyle.phonecontainerBorder,
                          formattedValue && commonStyle.phonecontainerBorderFocus,
                        ]}
                        textContainerStyle={commonStyle.phonetextContainerStyle}
                        textInputStyle={commonStyle.phonetextInputStyle}
                        codeTextStyle={commonStyle.phonecodeTextStyle}
                        flagButtonStyle={commonStyle.phoneflagButtonStyle}
                        countryPickerButtonStyle={
                          commonStyle.phonecountryPickerButtonStyle
                        }
                      />
                      {!mobile ? (
                        <Text style={commonStyle.inputfielderror}>Required</Text>
                      ) : null}
                      {/* {mobile.length<10 ? (
                    <Text style={commonStyle.inputfielderror}>Invalid mobile number</Text>
                  ) : null} */}
                    </View>
                  ) : null}
                </View>
                <View style={[commonStyle.mb2, commonStyle.contactDetailscheck]}>
                  <CheckBox
                    style={{ paddingVertical: 10 }}
                    onClick={() => emailSelectHelper()}
                    isChecked={isEmailChecked}
                    checkedCheckBoxColor={'#ff5f22'}
                    uncheckedCheckBoxColor={'#e6e7e8'}
                    leftText={'Email'}
                    leftTextStyle={commonStyle.blackTextR}
                    checkedImage={<CheckedBox />}
                    unCheckedImage={<UncheckedBox />}
                  />
                  {isEmailChecked == 1 ? (
                    <View style={[commonStyle.mt1, commonStyle.mb1]}>
                      <TextInput
                        style={[
                          commonStyle.textInput,
                          isEmailFocus && commonStyle.focusinput,
                        ]}
                        onFocus={() => setIsEmailFocus(true)}
                        onChangeText={(text) => setEmail(text)}
                        onBlur={(event) => validateEmail(event.target.value)}
                        returnKeyType="done"
                        keyboardType="email-address"
                        placeholder="Enter your email"
                        autoCapitalize={'none'}
                        value={email}
                      />
                      {isValidEmail || !email ? (
                        <Text style={commonStyle.inputfielderror}>
                          {isValidEmail || 'Required'}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
        {((isPhoneNumberChecked == 1 && mobile) || isPhoneNumberChecked == 0) &&
          ((isEmailChecked == 1 && email && !isValidEmail) ||
            isEmailChecked == 0) ? (
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title={isUpdate ? 'Update' : 'Save and Continue'}
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={contactHandler}
              // disabled={!isEmailChecked && !isPhoneNumberChecked}
              />
            </View>
          </View>
        ) : null}
        {/* </Container> */}
      </KeyboardAvoidingView>
    </Fragment>
  );
};

export default BusinessContacts;
