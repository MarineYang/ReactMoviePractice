import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  View,
  Text,
  FlatList
} from "react-native";
import { moviesApi }  from "../api";
import Swiper from 'react-native-swiper/src';
import styled from 'styled-components/native';
import Slide from "../components/Slide";
import HMedia from "../components/HMedia";
import VMedia from "../components/VMedia";

const API_KEY = "220b8280ee8622e315ade1769715e287";

const Container = styled.FlatList``;

const Loader = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const {height: SCREEN_HEIGHT} = Dimensions.get("window");
const ListTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
`;

const TrendingScroll = styled.FlatList`
  margin-top: 20px;
`;

const Movie = styled.View`
  margin-right: 20px;
  align-items: center;
`;

const Votes = styled.Text`
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
`;
const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 20px;
`;
const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { isLoading:nowPlayingLoading, data:nowPlayingData } = useQuery("nowPlaying", moviesApi.nowPlaying)
  const { isLoading:upcomingLoading, data:upcomingData } = useQuery("upcoming", moviesApi.upcoming)
  const { isLoading:trendingLoading, data:trendingData } = useQuery("trending", moviesApi.trending)

  const onRefresh = async () => {};
  const VSeparator = styled.View`width: 20px;`;
  const HSeparator = styled.View`height: 20px;`;


  const renderVMedia = ({ item }) => (
    <VMedia
      posterPath={item.poster_path}
      originalTitle={item.original_title}
      voteAverage={item.vote_average}
    />
  )
  const renderHMedia = ({ item }) => (
    <HMedia
      posterPath={item.poster_path}
      originalTitle={item.original_title}
      overview={item.overview}
      releaseDate={item.release_date}
    />
  )
  const loading = nowPlayingLoading || upcomingLoading || trendingLoading
  return loading ? (
      <Loader>
          <ActivityIndicator />
      </Loader>
  ) : (
    <FlatList
    onRefresh={onRefresh}
    refreshing={refreshing}
    ListHeaderComponent={
      <>
        <Swiper
          horizontal
          loop
          autoplay
          autoplayTimeout={3.5}
          showsButtons={false}
          showsPagination={false}
          containerStyle={{
            marginBottom: 40,
            width: "100%",
            height: SCREEN_HEIGHT / 4,
          }}
        >
          {nowPlayingData.results.map((movie) => (
            <Slide
              key={movie.id}
              backdropPath={movie.backdrop_path}
              posterPath={movie.poster_path}
              originalTitle={movie.original_title}
              voteAverage={movie.vote_average}
              overview={movie.overview}
            />
          ))}
        </Swiper>
        <ListContainer>
          <ListTitle>Trending Movies</ListTitle>
          <TrendingScroll
            data={trendingData.results}
            horizontal
            keyExtractor={(item) => item.id + ""}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 30 }}
            ItemSeparatorComponent={VSeparator}
            renderItem={renderVMedia}
        />
        </ListContainer>
        <ComingSoonTitle>Coming soon</ComingSoonTitle>
      </>
    }
      data={upcomingData.results}
      keyExtractor={(item) => item.id + ""}
      ItemSeparatorComponent={HSeparator}
      renderItem={renderHMedia}
      />
  );
};

export default Movies;