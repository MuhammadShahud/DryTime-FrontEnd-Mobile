import { MenuView } from '@react-native-menu/menu';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image, Platform } from 'react-native';
import { Colors, MaterialIcons } from '../../Theme';
import { createThumbnail } from "react-native-create-thumbnail";
import FastImage from 'react-native-fast-image';
import { img_url } from '../../Config/APIs';

const ActivityListCard = (props) => {
    const [thumbnail, setThumbnail] = useState(null)
    useEffect(() => {
        async function getThumb() {
            let thumb = await createThumbnail({
                url: props.Uri,
                timeStamp: 1000
            })
            setThumbnail(thumb);
        }
        getThumb();
    }, [])


    return (
        <TouchableOpacity style={styles.container} disabled={props.disabled} onPress={props.onPress}>
            <FastImage source={{ ...props.Image, cache: FastImage.cacheControl.immutable, priority: FastImage.priority.high }} style={styles.Img} />
            <View style={{ marginLeft: 10, justifyContent: 'center', flex: 1 }}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={styles.Heading}>{props.Heading}</Text>
                {props.Company ?
                    <Text adjustsFontSizeToFit numberOfLines={1} style={styles.Heading1}>{props.Company}</Text>
                    : null}
                <Text style={styles.Time}>Time: {props.Time}</Text>
            </View>
            {props.onPressDelete ?
                <MenuView
                    isAnchoredToRight
                    title="Menu Title"
                    onPressAction={({ nativeEvent }) => {
                        if (nativeEvent.event == "delete")
                            props.onPressDelete()
                    }}
                    actions={[
                        {
                            id: 'delete',
                            title: 'Delete',
                            attributes: {
                                destructive: true,
                            },
                            image: Platform.select({
                                ios: 'trash',
                                android: 'ic_menu_delete',
                            }),
                        },
                    ]}
                    shouldOpenOnLongPress={true}
                >
                    <TouchableOpacity>
                        <Icon name='more-vert' size="md" as={MaterialIcons} />
                    </TouchableOpacity>
                </MenuView> : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 13,
        borderRadius: 10,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: "center"
    },
    Img: {
        width: "30%",
        height: 90,
        resizeMode: 'contain',
        borderRadius: 6,
    },
    Heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
    },
    Heading1: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.black,
    },
    Time: {
        fontSize: 14,
        fontWeight: 'normal',
    },
})


export default ActivityListCard;