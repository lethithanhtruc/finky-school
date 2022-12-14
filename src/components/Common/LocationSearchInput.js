import React, {useEffect, useState} from "react";
import {Input, Spin} from "antd";
import PlacesAutocomplete from "react-places-autocomplete";
import './LocationSearchInput.scss';

const LocationSearchInput = ({onSelect, initialValue}) => {
    const [value, setValue] = useState(initialValue ? initialValue : null);
    const [suggestionSelected, setSuggestionSelected] = useState(null);
    const [searchOptions, setSearchOptions] = useState({
        componentRestrictions: {
            country: ['vn'],
        },
        types: ['address']
    });

    useEffect(() => {
        if(value == ""){
            onSelect("", "", "");
        }
    }, [value])

    useEffect(() => {
        if(suggestionSelected){
            setValue(suggestionSelected.description);
        }
    }, [suggestionSelected])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                // console.log('position.coords', position.coords)
                setSearchOptions(searchOptions => {
                    return {
                        ...searchOptions,
                        location: new window.google.maps.LatLng(latitude, longitude),
                        radius: 40000,
                    };
                });
            },
            () => {
                //...
                console.log('toa do error')
            }
        );
    }, [])

    const handleAddressChange = (address) => {
        setValue(address);
    }

    const handleSelect = (address, placeId, suggestion) => {
        // console.log('addressaddress', address, placeId, suggestion)
        // setValue(address);
        onSelect(address, placeId, suggestion);
        setSuggestionSelected(suggestion);
    };

    return (
        <>
            {/*<Input type="text" value={value} onChange={(e) => setValue(e.target.value)}  />*/}
            <PlacesAutocomplete
                onChange={handleAddressChange}
                onSelect={handleSelect}
                value={value}
                googleCallbackName="myCallbackFunc"
                debounce={200}
                shouldFetchSuggestions={value?.length > 9}
                searchOptions={searchOptions}
            >
                {({ getInputProps, getSuggestionItemProps, suggestions, loading }) => {
                    let msgError = null;
                    if(value != null){
                        if(getInputProps().value == ""){
                            msgError = 'Y??u c???u nh???p...';
                            suggestions = [];
                        }else if(getInputProps().value && getInputProps().value.length < 10){
                            msgError = 'T???i thi???u 10 k?? t???';
                            suggestions = [];
                        }else if(!suggestionSelected && (!initialValue || initialValue != value)){
                            msgError = 'Vui l??ng ch???n m???t trong c??c ?????a ch??? ???????c g???i ??';
                        }
                    }

                    return (
                        <>
                            <div className={`ant-form-item-with-help ${msgError ? 'ant-form-item-has-error' : ''}`}>
                                <Input
                                    {...getInputProps({
                                        id: "address-input",
                                        placeholder: 'Nh???p ?????a ch???. V?? d???: 1 Tr???n H??ng ?????o, Ph?????ng Nguy???n Th??i B??nh, Qu???n 1, H??? Ch?? Minh',
                                    })}
                                />
                            </div>
                            {msgError && <div className="ant-form-item-explain ant-form-item-explain-error">{msgError}</div>}

                            <div className="autocomplete-dropdown-container">
                                {loading ? <Spin className="loading-item" tip="Loading..."></Spin> : null}
                                {suggestions.map((suggestion) => {
                                {/*{([
                                    {
                                        active: true,
                                        placeId: "11111111",
                                        description: "01 Tr???n H??ng ?????o, ph?????ng Th??i B??nh, Qu???n 1, H??? Ch?? Minh",
                                    },
                                    {
                                        active: false,
                                        placeId: "222222222",
                                        description: "02 Tr???n H??ng ?????o, ph?????ng Th??i B??nh, Qu???n 1, H??? Ch?? Minh",
                                    },
                                    {
                                        active: false,
                                        placeId: "333333333333",
                                        description: "03 Tr???n H??ng ?????o, ph?????ng Th??i B??nh, Qu???n 1, H??? Ch?? Minh",
                                    },
                                    {
                                        active: false,
                                        placeId: "44444444",
                                        description: "04 Tr???n H??ng ?????o, ph?????ng Th??i B??nh, Qu???n 1, H??? Ch?? Minh",
                                    },
                                    {
                                        active: false,
                                        placeId: "555555555",
                                        description: "05 Tr???n H??ng ?????o, ph?????ng Th??i B??nh, Qu???n 1, H??? Ch?? Minh",
                                    },
                                ]).map((suggestion) => {*/}
                                    const className = "suggestion-item " + (suggestion.active ? "suggestion-item--active" : "");

                                    const spread = {
                                        ...getSuggestionItemProps(suggestion, {
                                            className,
                                        })
                                    };

                                    // console.log('suggestionsuggestion', suggestion)

                                    return (
                                        <div {...spread} key={suggestion.placeId}>
                                            <div>{suggestion.description}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    );
                }}
            </PlacesAutocomplete>
        </>
    );
};

export default LocationSearchInput;
