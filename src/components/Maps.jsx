import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { markerAPI } from '../lib/markerAPI';

const Maps = () => {
    const mapRef = useRef(null);
    const navigate = useNavigate();

    const [myLocation, setMyLocation] = useState(null);
    const [activeMarker, setActiveMarker] = useState(null); // 현재 선택된 마커 상태
    const [isMapLoading, setMapLoading] = useState(true);

    // 카카오맵 인스턴스를 저장하기 위한 ref
    const mapInstance = useRef({ map: null, infoWindow: null, clusterer: null });

    // 1. 지도 초기화, 데이터 로딩, 마커 생성 Effect
    useEffect(() => {
        // window.kakao 객체와 mapRef가 준비되었는지 확인
        if (!window.kakao || !mapRef.current) {
            return;
        }

        const samplePositions = [
            { id: 101, lat: 37.324, lng: 126.826, photos: [{ imagePath: "/sample/tresh-1.jpg" }], description: "도로변 캔/페트병", user: { name: "green**" } },
            { id: 102, lat: 37.383, lng: 126.929, photos: [{ imagePath: "/sample/tresh-1.jpg" }], description: "산책로 쓰레기", user: { name: "익명" } },
            { id: 102, lat: 37.33052773824914, lng: 126.82827632406895, photos: [{ imagePath: "/sample/tresh-1.jpg" }], description: "산책로 쓰레기", user: { name: "혜린" } },
        ];

        // 카카오 지도 라이브러리가 로드되면 지도 초기화 실행
        window.kakao.maps.load(() => {
            if (!mapRef.current) return;

            const initializeMap = async (center) => {
                const map = new window.kakao.maps.Map(mapRef.current, { center, level: 4 });
                mapInstance.current.map = map;

                // 마커 클러스터러 생성
                const clusterer = new window.kakao.maps.MarkerClusterer({
                    map: map,
                    averageCenter: true,
                    minLevel: 6,
                });
                mapInstance.current.clusterer = clusterer;

                // 내 위치 추적 마커
                const myMarker = new window.kakao.maps.Marker({ 
                    map, 
                    image: new window.kakao.maps.MarkerImage("/logo.svg", new window.kakao.maps.Size(24, 24), { offset: new window.kakao.maps.Point(12, 12) })
                });
                
                if (navigator.geolocation) {
                    myMarker.setPosition(center); // 초기 위치 설정
                    navigator.geolocation.watchPosition((pos) => {
                        const latlng = new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                        setMyLocation(latlng);
                        myMarker.setPosition(latlng);
                    }, console.warn, { enableHighAccuracy: true });
                }

                // 데이터 로딩
                let loadedMarkers = [];
                try {
                    const response = await markerAPI.list();
                    const apiMarkers = response.data.content.filter(m => m.status === 'ACTIVE');
                    loadedMarkers = [...apiMarkers, ...samplePositions];
                } catch (error) {
                    console.error("API 마커 로딩 실패:", error);
                    loadedMarkers = samplePositions;
                }

                // 마커 생성 및 클러스터러에 추가
                const markerImg = new window.kakao.maps.MarkerImage("/tresh.png", new window.kakao.maps.Size(40, 40), { offset: new window.kakao.maps.Point(20, 40) });
                const markersForCluster = loadedMarkers.map((markerData) => {
                    const marker = new window.kakao.maps.Marker({
                        position: new window.kakao.maps.LatLng(markerData.lat, markerData.lng),
                        image: markerImg,
                    });
                    window.kakao.maps.event.addListener(marker, 'click', () => setActiveMarker(markerData));
                    return marker;
                });
                clusterer.addMarkers(markersForCluster);

                // 공통 인포윈도우 생성
                mapInstance.current.infoWindow = new window.kakao.maps.InfoWindow({ removable: true });
                window.kakao.maps.event.addListener(mapInstance.current.infoWindow, 'closeclick', () => setActiveMarker(null));
                window.kakao.maps.event.addListener(map, 'click', () => setActiveMarker(null));

                setMapLoading(false);
            };

            // 현재 위치를 가져와서 지도 초기화
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const currentLatLng = new window.kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                        setMyLocation(currentLatLng);
                        initializeMap(currentLatLng);
                    },
                    (err) => {
                        console.warn("현재 위치를 가져올 수 없습니다. 기본 위치로 시작합니다.", err);
                        const defaultLatLng = new window.kakao.maps.LatLng(37.379, 126.929);
                        initializeMap(defaultLatLng);
                    }
                );
            } else {
                console.warn("Geolocation을 지원하지 않습니다. 기본 위치로 시작합니다.");
                const defaultLatLng = new window.kakao.maps.LatLng(37.379, 126.929);
                initializeMap(defaultLatLng);
            }
        });
    }, []);

    // 2. activeMarker 상태에 따라 인포윈도우를 열거나 닫는 Effect
    useEffect(() => {
        const { map, infoWindow } = mapInstance.current;
        if (!map || !infoWindow) return;

        if (activeMarker) {
            const position = new window.kakao.maps.LatLng(activeMarker.lat, activeMarker.lng);
            const isSample = activeMarker.photos && activeMarker.photos.length > 0 && !activeMarker.photos[0].imagePath.startsWith("/images");
            const imageUrl = isSample ? activeMarker.photos[0].imagePath : `http://localhost:8080${activeMarker.photos[0].imagePath}`;
            
            infoWindow.setContent(`
                <div style="width:260px; padding:10px; font-family: 'Pretendard', sans-serif;">
                    <div style="display:flex; gap:12px; align-items:center; margin-bottom:10px;">
                        <img src="${imageUrl}" alt="제보사진" style="width:84px;height:84px;object-fit:cover;border-radius:10px;" />
                        <div style="flex:1; min-width:0;">
                            <div style="font-weight:700; color:#2f6c1e;">제보자: ${activeMarker.user?.name || '익명'}</div>
                            <div style="font-size:13px; color:#333; margin-top:4px;">${activeMarker.description}</div>
                        </div>
                    </div>
                    <div id="distance-info" style="font-size:12px; margin-bottom:8px; text-align:center; font-weight:500; height:16px;"></div>
                    <button id="clean-btn" style="width:100%; background:#73C03F; color:white; border:none; border-radius:8px; padding:10px 0; font-weight:700; cursor:pointer; font-size:15px; transition: all 0.2s;">
                        거리 계산 중...
                    </button>
                </div>
            `);
            const markerForInfoWindow = new window.kakao.maps.Marker({ position });
            infoWindow.open(map, markerForInfoWindow);
            
            setTimeout(() => {
                const btn = document.getElementById('clean-btn');
                if(btn) btn.onclick = () => navigate(`/upload/${activeMarker.id}`);
            }, 100);
        } else {
            infoWindow.close();
        }
    }, [activeMarker, navigate]);

    // 3. 사용자의 위치나 activeMarker가 바뀔 때마다 버튼 상태를 업데이트하는 Effect
    useEffect(() => {
        if (!myLocation || !activeMarker) return;

        const line = new window.kakao.maps.Polyline({ path: [myLocation, new window.kakao.maps.LatLng(activeMarker.lat, activeMarker.lng)] });
        const distance = line.getLength();
        const isEnabled = distance >= 5 && distance <= 500;

        const btn = document.getElementById('clean-btn');
        const distInfo = document.getElementById('distance-info');
        if (!btn || !distInfo) return;

        btn.disabled = !isEnabled;
        if (isEnabled) {
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.innerText = '청소하러 가기';
            distInfo.innerHTML = ` ${Math.round(distance)}m 거리, 청소 가능!`;
            distInfo.style.color = '#2f6c1e';
        } else {
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
            btn.innerText = '청소하러 갈 수 없는 거리입니다';
            distInfo.style.color = '#dc3545';
            distInfo.style.marginbottom = '2px';
            if (distance > 500 ) {
                distInfo.innerHTML = `너무 멉니다 (${Math.round(distance)}m). 500m 이하로 접근해주세요.`;
            }
        }
    }, [myLocation, activeMarker]);

    return (
        <div>
            <div ref={mapRef} className='w-full h-[100vh]'>
                {isMapLoading && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.8)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', color: "grey" }}>
                        <p>지도를 불러오는 중입니다...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Maps;
