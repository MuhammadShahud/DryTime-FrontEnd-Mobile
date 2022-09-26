import { MenuView } from '@react-native-menu/menu';
import moment from 'moment';
import { Avatar, Icon } from 'native-base';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { backgroundColor } from 'styled-system';
import { Alex, Banner } from '../Assets';
import { img_url } from '../Config/APIs';
import { AntDesign, Colors, Ionicons, MaterialIcons } from '../Theme';

const MeetingListCard = (props) => {
    let time_in_meeting=moment((new Date(props.data.start_time).getTime()+(300*60000))).from(moment.now());
    //|| time_in_meeting.includes("in")
    return (
        <View style={styles.container}>
            <View style={{ margin: 5, flexDirection: "row", alignItems: "center" }}>
                <Avatar
                    style={{ borderWidth: 1, borderColor: "#ddd" }}
                    source={props.data.user?.profile_pic ? { uri: img_url + props.data.user?.profile_pic } : Alex} />
                <Text style={styles.Heading1}>{props.data.user?.username}</Text>
                {props.data.user?.id == props.c_user_id ?
                    props.onPressDelete ?
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
                            shouldOpenOnLongPress={false}
                        >
                            <Icon name='more-vert' size="md" as={MaterialIcons} />
                        </MenuView> : null
                    : <TouchableOpacity
                        onPress={() => props.navigation.navigate('ScheduleForm', { activity: { name: props.data.title, id: props.data.id } })}
                        style={styles.FlexRowRight}>
                        <AntDesign name={'plussquare'} size={20} color={Colors.black} />
                        <Text style={styles.TextReminder}>Add Reminder</Text>
                    </TouchableOpacity>
                }
            </View>
            <Image
                source={props.data.image ? { uri: img_url + props.data.image } : Banner}
                style={styles.Image}
            />
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.Heading}>
                        {props.data.title}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
                        <Ionicons name={'location'} size={15} color={Colors.black} />
                        <Text style={{ marginStart: 3 }}>
                            {props.data.address}
                        </Text>
                    </View>
                    <Text style={{ marginStart: 15 }}>
                        {props.data.description}
                    </Text>
                </View>
                <View>
                    {props.onMeetingPress ?
                        <TouchableOpacity
                            disabled={props.connecting}
                            onPress={props.onMeetingPress}
                            style={{ backgroundColor: props.connecting ? "#ddd" : Colors.Primary, padding: 10, borderRadius: 5 }}>
                            <Text style={{ fontSize: 12, color: "#fff" }}>{props.data.user?.id == props.c_user_id ? "Start Meeting" : "Join Meeting"}</Text>
                        </TouchableOpacity>
                        : null}
                </View>
            </View>
        </View>
    );
}
{/* <Ionicons name={'location'} size={20} color={Colors.black} /> */ }

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
        borderRadius: 6,
        backgroundColor: Colors.white,
        marginBottom: 15,
    },
    Image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        resizeMode: "cover",
        marginVertical: 10
    },
    Heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
    },
    Heading1: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
        marginStart: 10,
        flex: 1
    },
    FlexRowRight: {
        flexDirection: "row",
        alignItems: "center"
    },
    TextReminder: {
        marginStart: 5
    }
})


export default MeetingListCard;