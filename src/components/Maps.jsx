import React from 'react';
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 

const Maps = () => {
    const mapRef = useRef(null);
    const mymarkerRef = useRef(null);
    const circleRef = useRef(null);
    const centeredOnce = useRef(false);
    const openInfoRef = useRef(null);
    const navigate = useNavigate();  

  useEffect(() => {
    const KAKAO_KEY = import.meta.env.VITE_KAKAO_JS_KEY;

    const onLoad = () => {
        window.kakao.maps.load(() => {
            if (!mapRef.current) return;
            const map = new window.kakao.maps.Map(mapRef.current, {
                center: new window.kakao.maps.LatLng(37.379, 126.929),
                level: 4,
            });

            //내위치 표시
            const myImageSrc = "/logo.svg";
            const myImageSize = new window.kakao.maps.Size(24, 24);
            const myImageOption = { offset: new window.kakao.maps.Point(12, 12) };
            const mymarkerImage = new window.kakao.maps.MarkerImage(
              myImageSrc,
              myImageSize,
              myImageOption
            );
    
            mymarkerRef.current = new window.kakao.maps.Marker({
                map,
                image: mymarkerImage,
            });
    
            circleRef.current = new window.kakao.maps.Circle({
              map,
              radius: 0,
              strokeWeight: 1,
              strokeColor: "#4C8BF5",
              strokeOpacity: 0.8,
              strokeStyle: "solid",
              fillColor: "#4C8BF5",
              fillOpacity: 0.2,
            });
    
            const updatePos = (pos) => {
                const { latitude, longitude, accuracy = 0 } = pos.coords;
                const latlng = new window.kakao.maps.LatLng(latitude, longitude);
    
                mymarkerRef.current.setPosition(latlng);
                circleRef.current.setPosition(latlng);
                circleRef.current.setRadius(accuracy);
    
                if (!centeredOnce.current) {
                    centeredOnce.current = true;
                    map.panTo(latlng);
                }
            };
    
            if ("geolocation" in navigator) {
                navigator.geolocation.watchPosition(
                    updatePos,
                    (err) => {
                        console.warn("geolocation error:", err);
                    },
                    {
                        enableHighAccuracy: true,
                        maximumAge: 10000,
                        timeout: 10000
                    }
                );
            } else {
                alert("이 브라우저는 위치 서비스를 지원하지 않습니다.");
            }

            //샘플 데이터
            //마커 생성
            const positions = [
                {
                    id: 101,
                    title: '안산1',
                    latlng: new window.kakao.maps.LatLng(37.324, 126.826),
                    photo: "/sample/tresh-1.jpg",
                    description: "도로변에 캔/페트병 혼재. 분리수거 필요.",
                    points: 100,
                    reporter: "green**",
                },
                {
                    id: 102,
                    title: '학교1',
                    latlng: new window.kakao.maps.LatLng(37.383, 126.929),
                    photo: "/sample/tresh-1.jpg",
                    description: "산책로 쓰레기봉투 투기.",
                    points: 35,
                    reporter: "익명"
                },
                {
                    id: 103,
                    title: '학교2',
                    latlng: new window.kakao.maps.LatLng(37.383833, 126.930579),
                    photo: "/sample/tresh-1.jpg",
                    description: "산책로 쓰레기봉투 투기.",
                    points: 35,
                    reporter: "익명"
                },
                {
                    id: 104,
                    title: '학교3',
                    latlng: new window.kakao.maps.LatLng(37.383599, 126.932172),
                    photo: "/sample/tresh-1.jpg",
                    description: "산책로 쓰레기봉투 투기.",
                    points: 35,
                    reporter: "익명"
                },
                {
                    id: 105,
                    title: '성결유치원',
                    latlng: new window.kakao.maps.LatLng(37.3805253, 126.9288159),
                    photo: "/sample/tresh-1.jpg",
                    description: "산책로 쓰레기봉투 투기.",
                    points: 35,
                    reporter: "익명"
                },
                {
                    id: 106,
                    title: '안산2',
                    latlng: new window.kakao.maps.LatLng(37.3305361, 126.8278983),
                    photo: "/sample/tresh-1.jpg",
                    description: "산책로 쓰레기봉투 투기.",
                    points: 35,
                    reporter: "익명",
                },

            ];

            // ✅ 인포윈도우 컨텐츠 HTML 생성 함수
        const makeInfoContent = (r) => {
          const img = r.photo || "/noimage.png";
          const desc = (r.description || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          return `
            <div style="width:260px; padding:10px 10px 8px 10px; box-sizing:border-box;">
              <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
                <img src="${img}" alt="report" style="width:84px;height:84px;object-fit:cover;border-radius:10px;border:1px solid #eee;" />
                <div style="flex:1;min-width:0;">
                  <div style="font-weight:700;color:#2f6c1e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    ${r.title}
                  </div>
                  <div style="font-size:12px;color:#666;margin-top:4px;max-height:40px;overflow:auto;">${desc}</div>
                  <div style="margin-top:6px;font-size:13px;color:#73C03F;font-weight:700;">+${r.points}P 획득 가능</div>
                </div>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#777;">
                <span>제보자: ${r.reporter || "익명"}</span>
                <button id="clean-btn-${r.id}"
          style="background:#73C03F;color:#fff;border:none;border-radius:9999px;padding:6px 12px;font-weight:700;cursor:pointer">
          청소하기
        </button>
              </div>
            </div>
          `;
        };

        // 지도 클릭하면 열린 창 닫기
        kakao.maps.event.addListener(map, "click", () => {
          if (openInfoRef.current) {
            openInfoRef.current.close();
            openInfoRef.current = null;
          }
        })

        const markerImg = new kakao.maps.MarkerImage(
            "/tresh.png",
            new kakao.maps.Size(40, 40),
            { offset: new kakao.maps.Point(27, 69) }
        );

        const infoWindow = new kakao.maps.InfoWindow({ removable: true });

        positions.forEach((r) => {
            const marker = new window.kakao.maps.Marker({
                map: map,
                image: markerImg,
                position: r.latlng,
                title: r.title,
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
                infoWindow.setContent(makeInfoContent(r)); // ✅ 내용 갱신
                infoWindow.open(map, marker);              
            });

            window.kakao.maps.event.addListener(infoWindow, "domready", () => {
                const btn = document.getElementById(`clean-btn-${r.id}`);
                if (!btn) return;

                // 중복 연결 방지: 한번만
                btn.onclick = null;
                btn.addEventListener(
                    "click",
                    () => {
                        //`/cleanup/${r.id}` 나중에 이렇게 바꾸기
                        navigate(`/Uploadpage/`, {
                            // 필요 시 함께 넘길 데이터
                            // state: {
                                
                            //     lat: r.latlng.getLat(),
                            //     lng: r.latlng.getLng(),
                            //     reporter: r.reporter,
                            //     points: r.points,
                            // },
                        });
                    },
                );
            });
        });

        
    });

    }
    const id = 'kakao-map-sdk';
    const existed = document.getElementById(id);

    if (!existed) {
        const script = document.createElement("script");
        script.id = id;
        script.async = true;
        script.src =
        `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}` +
        `&autoload=false&libraries=services,clusterer,drawing`;
        script.onload = onLoad;
        document.head.appendChild(script);
    } else if (window.kakao && window.kakao.maps) {
        onLoad();
    } else {
        existed.addEventListener("load", onLoad, { once: true });
    }
  }, []);

    return (
        <div>
            <div ref={mapRef} className='w-full h-[100vh]'></div>
        </div>
    );
};

export default Maps;