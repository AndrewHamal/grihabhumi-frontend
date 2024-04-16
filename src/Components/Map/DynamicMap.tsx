import { useEffect, useState } from 'react';
import Leaflet from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
const { MapContainer } = ReactLeaflet;
import { MarkerLayer, Marker } from "react-leaflet-marker";
import numDifferentiation from '@/Constant/helper';
import { Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from '@chakra-ui/react';
import PropertyCard from '../PropertyCard';
import { useRouter } from 'next/router';

const Map = ({ children, className, width, height, ...rest }: any) => {
  const { query } = useRouter()
  const [markers, setMarkets]: any = useState([])

  useEffect(() => {
    setMarkets((prev: any) => {
      var array3 = [...prev, ...rest.properties];

      array3 = array3.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.id === value.id && t.id === value.id
        ))
      )

      return array3
    })
  }, [rest.properties])

  // https://cdn.jsdelivr.net/gh/johan/world.geo.json@34c96bba/countries/NPL.geo.json
  return (
    <MapContainer className={"w-[100%] map-container h-[86vh]"} {...rest}>
      {
        markers?.map((res: any, key: number) => (
          res?.latitude && res?.longitude &&
          <MarkerLayer key={key} >
            <Marker
              position={[res?.latitude, res?.longitude]}
              interactive // required for riseOnHover
              riseOnHover
            >
              <Popover>
                <PopoverTrigger>
                  {/* <Pop */}
                  <div className='marker-in hover:bg-red-500 cursor-pointer bg-blue-500 flex gap-1 items-center rounded-[10px] px-2 py-[2px]'>
                    <img src='/assets/home.svg' style={{ width: 10, marginBottom: 1 }} />
                    {query?.project == 'true' ?
                      <div className='text-white'> {(res?.price_from ? ('Rs. ' + numDifferentiation(res?.price_from) + ' - ' + numDifferentiation(res?.price_to)) : 'Price on call')} </div> :
                      <div className='text-white text-[10px] font-[500]'>{numDifferentiation(res?.price)}</div>}
                  </div>
                </PopoverTrigger>

                <PopoverContent w={270} position={'relative'} zIndex={9999} rounded={13} padding={0}>
                  <PopoverArrow />
                  <PropertyCard
                    res={res}
                    isHf={true}
                    isProperty={true}
                  />
                </PopoverContent>
              </Popover>
            </Marker>
          </MarkerLayer>
        ))
      }
      {children(ReactLeaflet, Leaflet)}
    </MapContainer>
  )
}

export default Map;
