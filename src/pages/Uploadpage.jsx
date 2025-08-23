import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { markerAPI } from '../lib/markerAPI';
import { aiVerificationAPI } from '../lib/aiVerificationAPI';
import { getImageUrl } from '../lib/apiClient';
import { useAuth } from '../lib/authContext.jsx';

const Uploadpage = () => {
  const { markerId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [marker, setMarker] = useState(null);
  const [beforePhotos, setBeforePhotos] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('PENDING');
  const [verificationResult, setVerificationResult] = useState(null);
  const [gptResponse, setGptResponse] = useState('');
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [showVerificationDetails, setShowVerificationDetails] = useState(false);

  // 인증 확인
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
  }, [token, navigate]);

  // 마커 정보 로드
  useEffect(() => {
    if (markerId) {
      loadMarkerData();
    }
  }, [markerId]);

  const loadMarkerData = async () => {
    try {
      const res = await markerAPI.get(markerId);
      const markerData = res?.data?.data || res?.data || res;
      setMarker(markerData);
      
      // BEFORE 사진들 필터링 (BEFORE, before, 또는 type이 없는 경우)
      const beforePhotosData = (markerData.photos || []).filter(photo => 
        !photo.type || 
        photo.type === 'BEFORE' || 
        photo.type === 'before'
      );
      setBeforePhotos(beforePhotosData);
      
      // AI 검증 상태 확인
      checkVerificationStatus();
    } catch (error) {
      console.error('마커 데이터 로드 실패:', error);
    }
  };

  const checkVerificationStatus = async () => {
    try {
      console.log('검증 상태 확인 시작 - markerId:', markerId);
      const statusRes = await aiVerificationAPI.getStatus(markerId);
      console.log('검증 상태 원본 응답:', statusRes);
      
      // 백엔드 응답 구조를 유연하게 처리
      let statusData;
      
      if (statusRes && statusRes.data) {
        // ApiResponse 구조인지 확인
        if (statusRes.data.data && typeof statusRes.data.data === 'object') {
          // 구조 1: ApiResponse<Map<String, Object>>
          statusData = statusRes.data.data;
          console.log('상태 ApiResponse 구조로 파싱됨');
        } else if (statusRes.data.verificationStatus !== undefined) {
          // 구조 2: 직접 Map<String, Object>
          statusData = statusRes.data;
          console.log('상태 직접 Map으로 파싱됨');
        }
      } else if (statusRes && statusRes.verificationStatus !== undefined) {
        // 구조 3: 최상위 Map<String, Object>
        statusData = statusRes;
        console.log('상태 최상위 Map으로 파싱됨');
      }
      
      console.log('파싱된 상태 데이터:', statusData);
      
      if (statusData) {
        setVerificationStatus(statusData.verificationStatus || 'PENDING');
        setGptResponse(statusData.gptResponse || '');
        
        // 이미 검증이 완료된 경우 결과 설정
        if (statusData.verificationStatus === 'APPROVED' || statusData.verificationStatus === 'REJECTED') {
          setVerificationResult(statusData.verificationStatus);
          console.log('기존 검증 결과 발견:', statusData.verificationStatus);
        }
      }
    } catch (error) {
      console.error('검증 상태 확인 실패:', error);
      console.error('에러 상세:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('업로드할 사진을 선택해주세요.');
      return;
    }

    setIsUploading(true);
    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('marker_id', markerId); // 백엔드 요구사항에 맞춰 marker_id 사용
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      // 백엔드의 실제 엔드포인트 사용: /photos/upload/cleanup
      const response = await fetch(`http://localhost:8080/photos/upload/cleanup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        alert('청소 인증 사진이 업로드되었습니다! AI 검증을 시작합니다.');
        
        // AI 검증 수행
        await performAIVerification();
      } else {
        const errorData = await response.json();
        alert('사진 업로드에 실패했습니다: ' + (errorData.message || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const performAIVerification = async () => {
    try {
      setVerificationStatus('VERIFYING');
      
      console.log('AI 검증 시작 - markerId:', markerId);
      
      // AI 검증 요청
      const verificationRes = await aiVerificationAPI.verify(markerId);
      console.log('AI 검증 원본 응답:', verificationRes);
      
      // 백엔드 응답 구조를 유연하게 처리
      // 가능한 구조들:
      // 1. verificationRes.data.data (ApiResponse<GptVerificationResponseDTO>)
      // 2. verificationRes.data (직접 GptVerificationResponseDTO)
      // 3. verificationRes (직접 GptVerificationResponseDTO)
      let verificationData;
      
      if (verificationRes && verificationRes.data) {
        // ApiResponse 구조인지 확인
        if (verificationRes.data.data && typeof verificationRes.data.data === 'object') {
          // 구조 1: ApiResponse<GptVerificationResponseDTO>
          verificationData = verificationRes.data.data;
          console.log('ApiResponse 구조로 파싱됨');
        } else if (verificationRes.data.success !== undefined) {
          // 구조 2: 직접 GptVerificationResponseDTO
          verificationData = verificationRes.data;
          console.log('직접 GptVerificationResponseDTO로 파싱됨');
        }
      } else if (verificationRes && verificationRes.success !== undefined) {
        // 구조 3: 직접 GptVerificationResponseDTO
        verificationData = verificationRes;
        console.log('최상위 GptVerificationResponseDTO로 파싱됨');
      }
      
      console.log('파싱된 검증 데이터:', verificationData);
      
      if (!verificationData) {
        console.error('검증 데이터를 찾을 수 없습니다. 전체 응답:', verificationRes);
        console.error('응답 구조 분석:', {
          hasData: !!verificationRes?.data,
          dataType: typeof verificationRes?.data,
          hasDataData: !!verificationRes?.data?.data,
          dataDataType: typeof verificationRes?.data?.data,
          hasSuccess: verificationRes?.success !== undefined,
          hasDataSuccess: verificationRes?.data?.success !== undefined
        });
        throw new Error('검증 응답 데이터를 파싱할 수 없습니다.');
      }
      
      // GptVerificationResponseDTO의 success 필드 확인
      if (verificationData.success) {
        const result = verificationData.verificationResult;
        setVerificationResult(result);
        setGptResponse(verificationData.gptResponse || '');
        
        console.log('검증 결과:', result);
        console.log('GPT 응답:', verificationData.gptResponse);
        
        if (result === 'APPROVED') {
          alert('🎉 AI 검증 성공! 100포인트가 적립되었습니다.\n\n청소 완료된 마커는 지도에서 숨겨집니다.');
          
          // 성공한 마커 상태 변경
          await updateMarkerStatus();
          
        } else if (result === 'REJECTED') {
          alert('❌ AI 검증 실패: ' + (verificationData.gptResponse || '청소가 제대로 되지 않았습니다.'));
        } else {
          alert('⚠️ 예상치 못한 검증 결과: ' + result);
        }
      } else {
        // 검증 실패 시 에러 메시지 표시
        const errorMsg = verificationData.errorMessage || '알 수 없는 검증 오류';
        console.error('AI 검증 실패:', errorMsg);
        alert('AI 검증에 실패했습니다: ' + errorMsg);
      }
      
      setVerificationStatus('COMPLETED');
      
    } catch (error) {
      console.error('AI 검증 중 오류 발생:', error);
      console.error('에러 상세:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      setVerificationStatus('ERROR');
      
      // 사용자에게 더 구체적인 에러 메시지 제공
      let errorMessage = 'AI 검증 중 오류가 발생했습니다.';
      if (error.response?.status === 400) {
        errorMessage = '검증 요청이 잘못되었습니다. 사진을 다시 확인해주세요.';
      } else if (error.response?.status === 404) {
        errorMessage = '검증할 마커를 찾을 수 없습니다.';
      } else if (error.response?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }
      
      alert(errorMessage);
    }
  };

  const updateMarkerStatus = async () => {
    try {
      console.log('마커 상태 업데이트 시도:', markerId, 'CLEANED');
      const response = await markerAPI.updateStatus(markerId, 'CLEANED');
      console.log('마커 상태 업데이트 성공:', response);
      
      // 맵 페이지로 이동
      navigate('/map');
    } catch (error) {
      console.error('마커 상태 업데이트 실패:', error);
      console.error('에러 상세:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // 상태 업데이트 실패 시 사용자에게 안내
      alert('마커 상태 변경에 실패했습니다. 관리자에게 문의해주세요.\n\n에러: ' + (error.response?.data?.message || error.message));
      
      // 맵 페이지로 이동 (마커는 그대로 유지)
      navigate('/map');
    }
  };

  const setImageSuccess = (photoId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [photoId]: { loading: false, error: false }
    }));
  };

  const setImageError = (photoId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [photoId]: { loading: false, error: true }
    }));
  };

  if (!marker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#73C03F] mx-auto mb-4"></div>
          <p className="text-gray-600">마커 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#73C03F] text-white min-h-screen'>
      <div className='flex'>
        <button onClick={() => navigate("/map")}>
          <img src='/navigate-before.png' className='w-10 mt-5 ml-2' alt="뒤로가기"/>
        </button>
        <span className='font-bold mt-7 mr-2'>청소 인증 업로드</span>
        <img src='/goodtresh.png' className='w-10 h-10 mt-4'/>
      </div>

      <div className='mt-10 p-2'>
        <p className='ml-2 mb-2'>위치</p>
        <div className='flex mb-5 items-center'>
          <img src='/marker.png' className='ml-2 w-3 h-4 mr-2' alt="위치 마커"/>
          <span className='font-bold text-xl px-2 mr-2'>
            {marker?.description || '위치 정보'}
          </span>
        </div>
      </div>

      <div className='bg-white text-[#73C03F] rounded-t-3xl'>
        <div className='p-5'>
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">제보된 사진 (청소 전)</h2>
            <div className="grid grid-cols-2 gap-4">
              {beforePhotos.length > 0 ? (
                beforePhotos.map((photo, index) => {
                  const photoId = photo.id || index;
                  const imageUrl = photo.imagePath ? getImageUrl(photo.imagePath) : '/tresh.png';
                  const imageState = imageLoadingStates[photoId] || { loading: true, error: false };
                  
                  return (
                    <div key={photoId} className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 relative">
                      {/* 로딩 중 표시 */}
                      {imageState.loading && (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#73C03F] mx-auto mb-2"></div>
                            <div className="text-xs text-gray-500">로딩 중...</div>
                          </div>
                        </div>
                      )}
                      
                      {/* 이미지 */}
                      <img 
                        src={imageUrl} 
                        alt={`제보사진 ${index + 1}`} 
                        className={`w-full h-full object-cover ${imageState.loading ? 'hidden' : ''}`}
                        onLoad={() => {
                          console.log(`이미지 로딩 성공:`, imageUrl);
                          setImageSuccess(photoId);
                        }}
                        onError={(e) => {
                          console.error(`이미지 로딩 실패:`, imageUrl);
                          setImageError(photoId);
                          e.target.style.display = 'none';
                        }}
                      />
                      
                      {/* 에러 상태 표시 */}
                      {imageState.error && (
                        <div className="w-full h-full bg-red-50 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-red-400 text-2xl mb-2">📸</div>
                            <div className="text-xs text-red-500">이미지 로딩 실패</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-8">
                  <div className="text-gray-400 mb-2">📸</div>
                  <p className="text-gray-500">제보된 사진이 없습니다.</p>
                </div>
              )}
            </div>
            {beforePhotos.length > 0 && (
              <div className="mt-2 text-sm text-gray-500 text-center">
                총 {beforePhotos.length}장의 제보 사진
              </div>
            )}
          </section>

          <hr className="my-6" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">청소 후 사진 업로드</h2>
            <div className='space-y-4'>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  청소 완료 사진 선택
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#73C03F] file:text-white hover:file:bg-[#5a9a32]"
                />
                <p className="mt-1 text-sm text-gray-500">
                  청소 전후를 비교할 수 있는 명확한 사진을 업로드해주세요.
                </p>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>{selectedFiles.length}장</strong>의 사진이 선택되었습니다.
                  </p>
                </div>
              )}
              
              <button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className="w-full bg-[#73C03F] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#5a9a32] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? '업로드 중...' : '사진 업로드 및 AI 검증'}
              </button>
            </div>
          </section>

          {/* AI 검증 상태 섹션 */}
          {verificationStatus !== 'PENDING' && (
            <section className="mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">AI 검증 상태</h2>
              
              {/* 검증 상태 표시 */}
              <div className="mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    verificationStatus === 'VERIFYING' ? 'bg-yellow-400' :
                    verificationStatus === 'APPROVED' ? 'bg-green-400' :
                    verificationStatus === 'REJECTED' ? 'bg-red-400' :
                    'bg-gray-400'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {verificationStatus === 'VERIFYING' ? '검증 중...' :
                     verificationStatus === 'APPROVED' ? '검증 성공' :
                     verificationStatus === 'REJECTED' ? '검증 실패' :
                     '알 수 없음'}
                  </span>
                </div>
              </div>

              {/* 검증 결과 표시 */}
              {verificationResult && (
                <div className={`p-4 rounded-lg mb-4 ${
                  verificationResult === 'APPROVED' ? 'bg-green-50 border border-green-200' :
                  'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-lg ${
                      verificationResult === 'APPROVED' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {verificationResult === 'APPROVED' ? '✅' : '❌'}
                    </span>
                    <span className={`font-semibold ${
                      verificationResult === 'APPROVED' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {verificationResult === 'APPROVED' ? 'AI 검증 성공!' : 'AI 검증 실패'}
                    </span>
                  </div>
                  
                  {verificationResult === 'APPROVED' && (
                    <div className="text-green-700 text-sm">
                      <p>축하합니다! 100포인트가 적립되었습니다. 🎉</p>
                      <p className="mt-1 text-xs">청소 완료된 마커는 지도에서 자동으로 숨겨집니다.</p>
                    </div>
                  )}
                </div>
              )}

              {/* GPT 응답 표시 */}
              {gptResponse && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">AI 분석 결과</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{gptResponse}</p>
                  </div>
                </div>
              )}

              {/* 검증 진행 상태 */}
              {verificationStatus === 'VERIFYING' && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#73C03F] mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">AI가 사진을 분석하고 있습니다...</p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Uploadpage;
