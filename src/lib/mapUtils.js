
const KAKAO_KEY = import.meta.env.VITE_KAKAO_JS_KEY;
const KAKAO_SDK_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services&autoload=false`;

let isKakaoMapSdkLoaded = false;

const loadKakaoMapSdk = () => {
    return new Promise((resolve, reject) => {
        // If already loaded, resolve immediately
        if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
            isKakaoMapSdkLoaded = true;
            resolve(window.kakao);
            return;
        }
        
        // If script tag exists, it might be still loading
        const scriptId = 'kakao-map-sdk';
        let script = document.getElementById(scriptId);
        if (script && !isKakaoMapSdkLoaded) {
             script.addEventListener('load', () => {
                isKakaoMapSdkLoaded = true;
                window.kakao.maps.load(() => resolve(window.kakao));
            });
            script.addEventListener('error', (e) => reject(e));
            return;
        }

        // Otherwise, create and append the script
        script = document.createElement("script");
        script.id = scriptId;
        script.src = KAKAO_SDK_URL;
        
        script.onload = () => {
            window.kakao.maps.load(() => {
                isKakaoMapSdkLoaded = true;
                resolve(window.kakao);
            });
        };
        script.onerror = (e) => reject(e);

        document.head.appendChild(script);
    });
};

export const getAddressFromCoords = async (lat, lng) => {
    try {
        const kakao = await loadKakaoMapSdk();
        const geocoder = new kakao.maps.services.Geocoder();
        
        return new Promise((resolve, reject) => {
            geocoder.coord2Address(lng, lat, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    const address = result[0]?.road_address?.address_name || result[0]?.address?.address_name;
                    resolve(address || "주소를 찾을 수 없습니다.");
                } else {
                    reject(new Error("Failed to convert coordinates to address."));
                }
            });
        });
    } catch (error) {
        console.error("Kakao SDK/Geocoder error:", error);
        return "주소 변환 중 오류가 발생했습니다.";
    }
};
