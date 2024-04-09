<template>

    <div class="address-template">

        <BFormGroup label-cols-sm="4" label="Address">
            <BFormInput
                placeholder="Street address and number"
                :name="`${prefix}_line_one`"
                :value="value.line_one"
                :id="`${prefix}_line_one`"
                :state="states.line_one"
                @input="v=>input(v,'line_one')"
                required
                ></BFormInput>
        </BFormGroup>

        <BFormGroup label-cols-sm="4" label="">
            <BFormInput
                    placeholder="Unit Number"
                    :name="`${prefix}_line_two`"
                    :value="value.line_two"
                    id="line_two"
                    :state="states.line_two"
                    @input="v=>input(v,'line_two')"
                    ></BFormInput>
        </BFormGroup>

        <BFormGroup label-cols-sm="4" label="City">
            <BFormInput
                    placeholder="City"
                    :name="`${prefix}_city`"
                    :value="value.city"
                    id="city"
                    @input="v=>input(v,'city')"
                    :state="states.city"
                    ></BFormInput>
        </BFormGroup>

        <BFormGroup label-cols-sm="4" label="State">
            <BFormSelect v-if="!floridaOnly"
                    placeholder="-- Select a state --"
                    :name="`${prefix}_state`"
                    :value="value.state"
                    @input="v=>input(v,'state')"
                    :options="stateOptions"
                    :state="states.state">
                <template slot="first">
                    <option :value="null" disabled>-- Select a state --</option>
                </template>
            </BFormSelect>
            <BFormInput v-else disabled readonly value="Florida"></BFormInput>
        </BFormGroup>

        <BFormGroup label-cols-sm="4" label="Zip Code">
            <BFormInput  :name="`${prefix}_postcode`" :value="value.postcode" id="postcode" @input="v=>input(v,'postcode')" :states="states.postcode"></BFormInput>
        </BFormGroup>


    </div>

</template>

<script>

    import usa_states from '../data/usa-states';
    import {BFormGroup, BFormInput, BFormSelect} from 'bootstrap-vue';
    import {Address} from '../Classes';

    export default {

        name: 'InputAddress',

        usa_states: usa_states,

        components: {BFormGroup, BFormInput, BFormSelect},

        props: {
            value: {
                type: Object,
                default: () => new Address()
            },
            floridaOnly: {
                type: Boolean,
                default: false
            },
            states: {

            },
            required: {
                type: Boolean,
                default: false
            },
            allowForeign: {
                type: Boolean,
                default: false,
            }
        },
        computed: {
            stateOptions()
            {
                if (this.allowForeign) {
                    return {
                        '': '--',
                        ...this.$options.usa_states
                    }
                } else {
                    return this.$options.usa_states;
                }
            }
        },
        data() {
            return {
                prefix: (Math.random()*1e32).toString(36)
            }
        },
        mounted() {
            if ( this.floridaOnly ) {
                this.input('FL', 'state');
            }
            const lineOne = document.getElementById(`${this.prefix}_line_one`);

            const autocomplete = new google.maps.places.Autocomplete(lineOne, {
                types: ["address"],
                fields: ["address_components"],
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(27.994402, -81.760254)
                )
            });

            google.maps.event.addListener(autocomplete, "place_changed", () => {
                console.log(autocomplete.getPlace());

                const mapping = {
                    street_number: "line_one",
                    route: "line_one",
                    locality: "city",
                    postal_code: "postcode"
                }

                let place = {
                    address_component: [],
                    ...autocomplete.getPlace()
                };

                const newValue = {...this.value};
                for (const type in mapping) {
                    newValue[mapping[type]] = "";
                }

                place.address_components.forEach((component) => {
                    component.types.forEach((type) => {
                        if (mapping.hasOwnProperty(type)) {
                            if (type === "street_number" || type === "route") {
                                let street_number = place.address_components.find((e) => e.types.includes('street_number') === true);
                                let route = place.address_components.find((e) => e.types.includes('route') === true);
                                street_number = street_number !== undefined ? street_number.long_name : '';
                                route = route !== undefined ? route.long_name : '';

                                newValue[mapping[type]] = street_number + ' ' + route;
                                // this.$emit('update:' + mapping[type], street_number + ' ' + route);
                            }
                            else {
                                newValue[mapping[type]] = component.long_name;
                                // this.$emit('update:' + mapping[type], component.long_name);
                            }
                        }
                    });
                });

                this.$emit('input', newValue);
            });
        },
        methods: {
            input(value, key) {
                var v = {...this.value};
                v[key] = value;
                if (document.getElementById(key) !== null)
                    document.getElementById(key).value = value;

                if ( this.floridaOnly ) {
                    v.state = 'FL';
                }

                this.$emit('input', v);
                this.$emit(`update:${key}`, value);
            }
        }
    };

</script>