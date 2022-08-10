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
                            msgError = 'Yêu cầu nhập...';
                            suggestions = [];
                        }else if(getInputProps().value && getInputProps().value.length < 10){
                            msgError = 'Tối thiểu 10 kí tự';
                            suggestions = [];
                        }else if(!suggestionSelected && (!initialValue || initialValue != value)){
                            msgError = 'Vui lòng chọn một trong các địa chỉ được gợi ý';
                        }
                    }

                    return (
                        <>
                            <div className={`ant-form-item-with-help ${msgError ? 'ant-form-item-has-error' : ''}`}>
                                <Input
                                    {...getInputProps({
                                        id: "address-input",
                                        placeholder: 'Nhập địa chỉ. Ví dụ: 1 Trần Hưng Đạo, Phường Nguyễn Thái Bình, Quận 1, Hồ Chí Minh',
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
                                        description: "01 Trần Hưng Đạo, phường Thái Bình, Quận 1, Hồ Chí Minh",
                                    },
                                    {
                                        active: false,
                                        placeId: "222222222",
                                        description: "02 Trần Hưng Đạo, phường Thái Bình, Quận 1, Hồ Chí Minh",
                                    },
                                    {
                                        active: false,
                                        placeId: "333333333333",
                                        description: "03 Trần Hưng Đạo, phường Thái Bình, Quận 1, Hồ Chí Minh",
                                    },
                                    {
                                        active: false,
                                        placeId: "44444444",
                                        description: "04 Trần Hưng Đạo, phường Thái Bình, Quận 1, Hồ Chí Minh",
                                    },
                                    {
                                        active: false,
                                        placeId: "555555555",
                                        description: "05 Trần Hưng Đạo, phường Thái Bình, Quận 1, Hồ Chí Minh",
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
