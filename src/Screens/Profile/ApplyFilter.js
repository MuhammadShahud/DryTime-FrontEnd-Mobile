import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions
} from 'react-native';
import {
    AdenCompat,
    _1977Compat,
    BrannanCompat,
    BrooklynCompat,
    ClarendonCompat,
    EarlybirdCompat,
    GinghamCompat,
    HudsonCompat,
    InkwellCompat,
    KelvinCompat,
    LarkCompat,
    LofiCompat,
    MavenCompat,
    MayfairCompat,
    MoonCompat,
    NashvilleCompat,
    PerpetuaCompat,
    ReyesCompat,
    RiseCompat,
    SlumberCompat,
    StinsonCompat,
    ToasterCompat,
    ValenciaCompat,
    WaldenCompat,
    WillowCompat,
    Xpro2Compat,
} from 'react-native-image-filter-kit';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { BG } from '../../Assets';
import { Button } from '../../Components';
import Header from '../../Components/Header';
import { Colors, MaterialIcons, SCREEN_HEIGHT, SCREEN_WIDTH } from "../../Theme/";
import Draggable from 'react-native-draggable';
import ColorPicker from 'react-native-wheel-color-picker';
import * as Animatable from 'react-native-animatable';
import VideoPlayer from 'react-native-video-player';
import ImageResizer from 'react-native-image-resizer';
import Video from 'react-native-video';


const FILTERS = [
    {
        title: 'Normal',
        filterComponent: AdenCompat,
    },
    {
        title: 'Maven',
        filterComponent: MavenCompat,
    },
    {
        title: 'Mayfair',
        filterComponent: MayfairCompat,
    },
    {
        title: 'Moon',
        filterComponent: MoonCompat,
    },
    {
        title: 'Nashville',
        filterComponent: NashvilleCompat,
    },
    {
        title: 'Perpetua',
        filterComponent: PerpetuaCompat,
    },
    {
        title: 'Reyes',
        filterComponent: ReyesCompat,
    },
    {
        title: 'Rise',
        filterComponent: RiseCompat,
    },
    {
        title: 'Slumber',
        filterComponent: SlumberCompat,
    },
    {
        title: 'Stinson',
        filterComponent: StinsonCompat,
    },
    {
        title: 'Brooklyn',
        filterComponent: BrooklynCompat,
    },
    {
        title: 'Earlybird',
        filterComponent: EarlybirdCompat,
    },
    {
        title: 'Clarendon',
        filterComponent: ClarendonCompat,
    },
    {
        title: 'Gingham',
        filterComponent: GinghamCompat,
    },
    {
        title: 'Hudson',
        filterComponent: HudsonCompat,
    },
    {
        title: 'Inkwell',
        filterComponent: InkwellCompat,
    },
    {
        title: 'Kelvin',
        filterComponent: KelvinCompat,
    },
    {
        title: 'Lark',
        filterComponent: LarkCompat,
    },
    {
        title: 'Lofi',
        filterComponent: LofiCompat,
    },
    {
        title: 'Toaster',
        filterComponent: ToasterCompat,
    },
    {
        title: 'Valencia',
        filterComponent: ValenciaCompat,
    },
    {
        title: 'Walden',
        filterComponent: WaldenCompat,
    },
    {
        title: 'Willow',
        filterComponent: WillowCompat,
    },
    {
        title: 'Xpro2',
        filterComponent: Xpro2Compat,
    },
    {
        title: 'Aden',
        filterComponent: AdenCompat,
    },
    {
        title: '_1977',
        filterComponent: _1977Compat,
    },
    {
        title: 'Brannan',
        filterComponent: BrannanCompat,
    },
];

const { width, height } = Dimensions.get("window")

const ApplyFilter = (props) => {
    //'https://www.hyundai.com/content/hyundai/ww/data/news/data/2021/0000016609/image/newsroom-0112-photo-1-2021elantranline-1120x745.jpg'
    const [filtering, setFiltering] = useState(false)
    const extractedUri = useRef("");
    const colorPopupView = useRef();
    const filterImg = useRef();
    const normalImg = useRef();
    const [caption, addCaption] = useState(false);
    const [captionToPic, addCaptionToPic] = useState(true);
    const [captionText, setCaptionText] = useState("");
    const [selectedFilterIndex, setIndex] = useState(0);
    const [color, setColor] = useState("#fff");
    const [bold, setBold] = useState(false);
    const [colorPopup, setColorPopup] = useState(false);
    const [fontSize, setFontSize] = useState(20);
    const [fontSizePopup, setFontSizePopup] = useState(false);
    const [optimizedImage, setOptimizedImage] = useState(false);
    const [textY, setTextY] = useState(0);

    useEffect(() => {
        ImageResizer.createResizedImage(props.image, 120, 140, "PNG", 0.9).then((response) => {
            setOptimizedImage(response.uri)
        }).
            catch((reason) => {
                console.warn("can't optimized image", reason)
            })
    }, [])

    const onExtractImage = ({ nativeEvent }) => {
        extractedUri.current = nativeEvent.uri;
        setFiltering(false)
    };
    const onSelectFilter = selectedIndex => {
        setIndex(selectedIndex);
    };
    const renderFilterComponent = ({ item, index }) => {
        const FilterComponent = item.filterComponent;
        const image = (
            <Image
                style={styles.filterSelector}
                source={{ uri: optimizedImage }}
                resizeMode={'cover'}
            />
        );
        return (
            <TouchableOpacity onPress={() => onSelectFilter(index)}>
                <FilterComponent image={image} />
                <Text style={styles.filterTitle}>{item.title}</Text>
            </TouchableOpacity>
        );
    };

    const SelectedFilterComponent = FILTERS[selectedFilterIndex].filterComponent;
    if (props.type.includes("image"))
        return (
            <>
                <SafeAreaView />
                <ImageBackground source={BG} style={styles.container}>
                    <Header
                        headingStyle={{ marginEnd: "7%" }}
                        title={'Apply Filter'}
                    />
                    <View style={{ flex: 1 }}>
                        {selectedFilterIndex === 0 ? (
                            <View>
                                <ViewShot ref={component => normalImg.current = component}>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: props.image }}
                                        resizeMode={'stretch'}
                                    />
                                    {
                                        caption && captionToPic ?
                                            <Draggable
                                                x={0}
                                                y={textY}
                                                minX={0}
                                                maxX={0}
                                            // animatedViewProps={{ backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" }} >
                                            >
                                                <TextInput
                                                    value={captionText}
                                                    numberOfLines={3}
                                                    style={{ color, backgroundColor: "rgba(0,0,0,0.4)", textAlignVertical: "center", textAlign: "center", fontSize, height: fontSize > 33 ? 45 + ((fontSize / 3) * 2) : fontSize > 20 ? 45 + (fontSize / 3) : 45, width, fontWeight: bold ? "bold" : "normal" }}
                                                    onChangeText={(text) => setCaptionText(text)}
                                                />
                                            </Draggable>
                                            : null
                                    }
                                </ViewShot>
                                <View style={{ ...StyleSheet.absoluteFill, width: "100%", height: "100%", backgroundColor: "#fff" }}>
                                    <Image
                                        source={{ uri: props.image }}
                                        resizeMode="cover"
                                        style={{ ...StyleSheet.absoluteFill }}
                                    />
                                    {
                                        caption && captionToPic ?
                                            <Draggable
                                                x={0}
                                                y={0}
                                                onDragRelease={(event, gestureState, bounds) => {
                                                    setTextY(gestureState.moveY)
                                                }}
                                                minX={0}
                                                maxX={0}
                                                animatedViewProps={{ backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" }} >
                                                <TextInput
                                                    value={captionText}
                                                    numberOfLines={3}
                                                    style={{ color, textAlign: "center", fontSize, height: fontSize > 33 ? 45 + ((fontSize / 3) * 2) : fontSize > 20 ? 45 + (fontSize / 3) : 45, width, fontWeight: bold ? "bold" : "normal" }}
                                                    onChangeText={(text) => setCaptionText(text)}
                                                />
                                            </Draggable>
                                            : null
                                    }
                                </View>
                            </View>
                        ) : (
                            <SelectedFilterComponent
                                clearCachesMaxRetries={2}
                                onExtractImage={onExtractImage}
                                extractImageEnabled={true}
                                onFilteringStart={() => {
                                    setFiltering(true)
                                }}
                                image={
                                    <View style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
                                        <ViewShot
                                            style={{}}
                                            ref={component => filterImg.current = component}>
                                            <Image
                                                style={styles.image}
                                                source={{ uri: props.image }}
                                                resizeMode={'stretch'}
                                            />
                                            {
                                                caption && captionToPic ?
                                                    <Draggable
                                                        x={0}
                                                        y={textY}
                                                        minX={0}
                                                        maxX={0}
                                                    // animatedViewProps={{ backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" }} >
                                                    >
                                                        <TextInput
                                                            value={captionText}
                                                            numberOfLines={3}
                                                            style={{
                                                                backgroundColor: "rgba(0,0,0,0.4)",
                                                                color,
                                                                textAlign: "center",
                                                                textAlignVertical: "center",
                                                                fontSize, height: fontSize > 33 ? 45 + ((fontSize / 3) * 2) : fontSize > 20 ? 45 + (fontSize / 3) : 45,
                                                                width, fontWeight: bold ? "bold" : "normal"
                                                            }}
                                                            onChangeText={(text) => setCaptionText(text)}
                                                        />
                                                    </Draggable>
                                                    : null
                                            }
                                        </ViewShot>
                                        <View style={{ ...StyleSheet.absoluteFill, width: "100%", height: "100%", backgroundColor: "#fff" }}>
                                            <Image
                                                source={{ uri: extractedUri.current }}
                                                resizeMode="cover"
                                                style={{ ...StyleSheet.absoluteFill, }}
                                            />
                                            {
                                                caption && captionToPic ?
                                                    <Draggable
                                                        onDragRelease={(event, gestureState, bounds) => {
                                                            setTextY(gestureState.moveY)
                                                        }}
                                                        x={0}
                                                        y={0}
                                                        minX={0}
                                                        maxX={0}
                                                        animatedViewProps={{ backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" }} >
                                                        <TextInput
                                                            value={captionText}
                                                            numberOfLines={3}
                                                            style={{ color, textAlign: "center", fontSize, height: fontSize > 33 ? 45 + ((fontSize / 3) * 2) : fontSize > 20 ? 45 + (fontSize / 3) : 45, width, fontWeight: bold ? "bold" : "normal" }}
                                                            onChangeText={(text) => setCaptionText(text)}
                                                        />
                                                    </Draggable>
                                                    : null
                                            }
                                        </View>
                                    </View>
                                }
                            />
                        )}

                    </View>

                    <View style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
                        <View style={{ alignItems: "flex-end" }}>
                            {
                                caption ?
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => setColorPopup(true)}
                                            style={{ padding: 10 }}>
                                            <MaterialIcons name="color-lens" size={35} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setBold(!bold)}
                                            style={{ padding: 10 }}>
                                            <MaterialIcons name="format-bold" size={35} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setFontSizePopup(!fontSizePopup)}
                                            style={{ padding: 10 }}>
                                            <MaterialIcons name="format-size" size={35} color="#fff" />
                                        </TouchableOpacity>
                                        {
                                            fontSizePopup ?
                                                <Animatable.View animation={"bounceInRight"}>
                                                    <View
                                                        style={{
                                                            position: "absolute", bottom: 5, right: 50,
                                                            padding: 10, backgroundColor: "#fff", borderRadius: 10, elevation: 3
                                                        }}>
                                                        <View style={{ flexDirection: "row", }}>
                                                            <TouchableOpacity onPress={() => {
                                                                if (fontSize < 50)
                                                                    setFontSize(fontSize + 3)
                                                            }}>
                                                                <MaterialIcons name='add-circle' color={Colors.Primary} size={25} />
                                                            </TouchableOpacity>
                                                            <View style={{ margin: 5 }} />
                                                            <TouchableOpacity onPress={() => {
                                                                if (fontSize > 20)
                                                                    setFontSize(fontSize - 3)
                                                            }}>
                                                                <MaterialIcons name='remove-circle' color={Colors.Primary} size={25} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </Animatable.View>
                                                : null
                                        }
                                    </View>
                                    : null
                            }
                            <TouchableOpacity
                                onPress={() => addCaption(!caption)}
                                style={{ padding: 10 }}>
                                <MaterialIcons name="text-format" size={35} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <LinearGradient colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.5)"]} start={{ x: 0, y: 2 }} end={{ x: 0, y: 1 }} style={{ paddingBottom: 20 }}>
                            <FlatList
                                style={{ flex: 0, marginTop: 20, alignSelf: "flex-end" }}
                                data={FILTERS}
                                keyExtractor={item => item.title}
                                horizontal={true}
                                renderItem={renderFilterComponent}
                            />
                            <Button
                                // disabled={filtering}
                                ArrowRight
                                width={'100%'}
                                height={50}
                                name={props.SaveButtonText ? props.SaveButtonText : 'Save'}
                                textStyle={{
                                    fontSize: 16,
                                }}
                                btnStyle={{ marginTop: 20, marginHorizontal: 20, }}
                                onPress={async () => {
                                    let ref = null;
                                    if (selectedFilterIndex === 0)
                                        ref = normalImg.current
                                    else
                                        ref = filterImg.current

                                    if (captionText == "")
                                        addCaptionToPic(false)

                                    let uri = await captureRef(ref, {
                                        quality: 1.0,
                                        height: props.dimensions.height,
                                        width: props.dimensions.width,
                                    })
                                    props.onSave(uri)
                                }}
                            />
                        </LinearGradient>
                    </View>
                    {
                        colorPopup ?
                            <Animatable.View
                                ref={component => colorPopupView.current = component}
                                animation={"bounceIn"} style={{ position: "absolute", left: 20, right: 20, top: "15%", }}>
                                <View style={{ height: 500, backgroundColor: "#fff", padding: 20, elevation: 5, borderRadius: 10 }}>
                                    <ColorPicker
                                        color={color}
                                        swatchesOnly={false}
                                        onColorChangeComplete={(color) => { setColor(color) }}
                                        thumbSize={20}
                                        sliderSize={20}
                                        noSnap={true}
                                        row={false}
                                        swatchesLast={false}
                                        swatches={false}
                                        discrete={false}
                                    />
                                    <Button
                                        // disabled={filtering}
                                        ColorSecondary={Colors.Primary}
                                        ColorPrimary={Colors.Primary}
                                        ArrowRight
                                        width={'100%'}
                                        height={50}
                                        name={'Done'}
                                        textStyle={{
                                            fontSize: 16,
                                            color: "#fff"
                                        }}
                                        iconColor={"#fff"}
                                        btnStyle={{ marginTop: 20, marginHorizontal: 20 }}
                                        onPress={() => {
                                            colorPopupView.current.bounceOut(800).then(endState => endState.finished ? setColorPopup(false) : console.warn('bounce cancelled'));
                                        }}
                                    />
                                </View>
                            </Animatable.View>
                            : null}
                </ImageBackground>
            </>
        );
    else
        return (
            <>
                <SafeAreaView />
                <ImageBackground source={BG} style={styles.container}>
                    <Header
                        headingStyle={{ marginEnd: "7%" }}
                        title={'Apply Filter'}
                    />
                    <Video
                        source={{
                            uri: props.image,
                        }}
                        controls
                        style={{ marginBottom: 10, height: height * 0.8, width: width }}
                        resizeMode="contain"
                        paused
                        poster='https://static.vecteezy.com/system/resources/previews/003/589/714/original/play-button-icon-vector.jpg'
                        // onBuffer={(data) => {
                        //     this.setState({ buffering: data.isBuffering })
                        // }}
                    />
                    {/* <VideoPlayer
                        video={{
                            uri: props.image,
                        }}
                        videoWidth={width}
                        videoHeight={height * 0.8}
                        customStyles={{ borderRadius: 6, }}
                        //style={{ flex: 1 }}
                        resizeMode={'contain'}
                        // autoplay
                        defaultMuted={false}
                    /> */}
                    <Button
                        // disabled={filtering}
                        ArrowRight
                        width={'100%'}
                        height={50}
                        name={props.SaveButtonText ? props.SaveButtonText : 'Save'}
                        textStyle={{
                            fontSize: 16,
                        }}
                        btnStyle={{ marginTop: 20, marginHorizontal: 20, }}
                        onPress={() => {
                            props.onSave(props.image)
                        }}
                    />
                </ImageBackground>
            </>
        )
};
export default ApplyFilter;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2b2b2b"
    },
    image: {
        width: "100%",
        height: "100%",
        alignSelf: 'center',
        // backgroundColor: "#fff"
    },
    filterSelector: {
        width: 70,
        height: 70,
        margin: 5,
        borderRadius: 100,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#fff"
    },
    filterTitle: {
        fontSize: 12,
        textAlign: 'center',
        color: "#fff"
    },
});