var state = { year: null, dept: null, track: null, secondDept: null, files: [], autonomous: false };

var deptNames = {
  industrial:'공업디자인학과', visual:'시각디자인학과', metal:'금속공예학과',
  ceramic:'도자공예학과', fashion:'의상디자인학과', space:'공간디자인학과',
  media:'영상디자인학과', auto:'자동차·운송디자인학과', ai:'AI디자인학과'
};

var trackMsgs = {
  intensive: '전공 최저학점과 별개로 전공 <br>18학점 이상을 추가 이수해야해요',
  double: '제1전공 요건에 복수전공 최저학점(36학점 이상)을 별도로 추가 이수해야 해요',
  minor: '제1전공 요건에 부전공 18학점 <br>이상을 추가 이수해야 해요'
};

/* ─── CUSTOM DROPDOWN ─── */
window.toggleDD = function toggleDD(id) {
  var dd = document.getElementById(id);
  var trigger = dd.querySelector('.dd-trigger');
  var list = dd.querySelector('.dd-list');
  var isOpen = list.classList.contains('open');
  document.querySelectorAll('.dd-list.open').forEach(function(l) {
    l.classList.remove('open');
    l.previousElementSibling.classList.remove('open');
  });
  if (!isOpen) {
    list.classList.add('open');
    trigger.classList.add('open');
  }
};

document.addEventListener('click', function(e) {
  if (!e.target.closest('.custom-dd')) {
    document.querySelectorAll('.dd-list.open').forEach(function(l) {
      l.classList.remove('open');
      l.previousElementSibling.classList.remove('open');
    });
  }
});

document.addEventListener('click', function(e) {
  var item = e.target.closest('.dd-item');
  if (!item || item.classList.contains('disabled')) return;
  var ddId = item.getAttribute('data-dd');
  var val = item.getAttribute('data-val');
  var label = item.textContent.trim();
  var dd = document.getElementById(ddId);
  dd.querySelectorAll('.dd-item').forEach(function(i) { i.classList.remove('selected'); });
  item.classList.add('selected');
  var trigger = dd.querySelector('.dd-trigger');
  trigger.querySelector('.dd-label').textContent = label;
  trigger.classList.add('has-val');
  trigger.classList.remove('open');
  dd.querySelector('.dd-list').classList.remove('open');
  if (ddId === 'dd-year') {
    state.year = val;
    showStep('step2');
  } else if (ddId === 'dd-dept') {
    state.dept = val;
    document.querySelectorAll('#dd-second .dd-item').forEach(function(i) {
      i.classList.toggle('disabled', i.getAttribute('data-val') === val);
    });
    showStep('step3');
  } else if (ddId === 'dd-second') {
    state.secondDept = val;
  }
  checkBtn();
});

document.querySelectorAll('.option-btn[data-type="track"]').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var val = this.getAttribute('data-val');
    state.track = val;
    state.secondDept = null;
    document.querySelectorAll('.option-btn[data-type="track"]').forEach(function(b) { b.classList.remove('selected'); });
    this.classList.add('selected');
    var info = document.getElementById('track-info');
if (val === 'intensive') {
  info.innerHTML = '<span>' + trackMsgs[val] + '</span><button class="track-help-btn" onclick="openIntensivePopup()">?</button>';
  info.style.display = 'flex';
  info.style.alignItems = 'flex-start';
  info.style.justifyContent = 'space-between';
  info.style.gap = '8px';
} else if (val === 'minor') {
  info.innerHTML = '<span>' + trackMsgs[val] + '</span><button class="track-help-btn" onclick="openMinorPopup()">?</button>';
  info.style.display = 'flex';
  info.style.alignItems = 'flex-start';
  info.style.justifyContent = 'space-between';
  info.style.gap = '8px';
} else {
  info.innerHTML = trackMsgs[val];
  info.style.display = 'block';
  info.style.alignItems = '';
  info.style.justifyContent = '';
  info.style.gap = '';
}
    var card = document.getElementById('second-major-card');
    var label = document.getElementById('second-major-label');
    if (val === 'double' || val === 'minor') {
      card.classList.add('show');
      label.textContent = val === 'double' ? '어떤 전공을 복수전공 하시나요?' : '어떤 전공을 부전공 하시나요?';
      var ddSec = document.getElementById('dd-second');
      ddSec.querySelectorAll('.dd-item').forEach(function(i) { i.classList.remove('selected'); });
      ddSec.querySelector('.dd-label').textContent = '전공 선택하기';
      ddSec.querySelector('.dd-trigger').classList.remove('has-val');
      state.secondDept = null;
    } else {
      card.classList.remove('show');
      state.secondDept = null;
    }
    var yr = parseInt(state.year);
    document.getElementById('autonomous-toggle').style.display = (yr >= 24) ? 'flex' : 'none';
    showStep('step4');
    checkBtn();
  });
});

document.getElementById('autonomous-check').addEventListener('change', function() { state.autonomous = this.checked; });

/* ─── 심화전공 안내 팝업 ─── */
window.openIntensivePopup = function() {
  document.getElementById('intensive-popup-overlay').classList.add('open');
};
window.closeIntensivePopup = function() {
  document.getElementById('intensive-popup-overlay').classList.remove('open');
};
document.getElementById('intensive-popup-overlay').addEventListener('click', function(e) {
  if (e.target === this) window.closeIntensivePopup();
});
document.getElementById('popup-close-btn').addEventListener('click', window.closeIntensivePopup);

/* ─── 부전공 안내 팝업 ─── */
window.openMinorPopup = function() {
  document.getElementById('minor-popup-overlay').classList.add('open');
};
window.closeMinorPopup = function() {
  document.getElementById('minor-popup-overlay').classList.remove('open');
};
document.getElementById('minor-popup-overlay').addEventListener('click', function(e) {
  if (e.target === this) window.closeMinorPopup();
});
document.getElementById('minor-popup-close-btn').addEventListener('click', window.closeMinorPopup);

function showStep(id) {
  var el = document.getElementById(id);
  if (!el.classList.contains('visible')) {
    el.classList.add('visible');
    setTimeout(function() { el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
  }
}

document.getElementById('file-input').addEventListener('change', function() { handleFiles(this.files); });
var zone = document.getElementById('upload-zone');
zone.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('drag-over'); });
zone.addEventListener('dragleave', function() { this.classList.remove('drag-over'); });
zone.addEventListener('drop', function(e) { e.preventDefault(); this.classList.remove('drag-over'); handleFiles(e.dataTransfer.files); });

function handleFiles(files) {
  state.files = Array.from(files);
  var preview = document.getElementById('previews');
  preview.innerHTML = '';
  state.files.forEach(function(f) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = document.createElement('img');
      img.src = e.target.result; img.className = 'preview-thumb';
      preview.appendChild(img);
    };
    reader.readAsDataURL(f);
  });
  checkBtn();
}

function checkBtn() {
  var needSecond = (state.track === 'double' || state.track === 'minor');
  var ok = state.year && state.dept && state.track && state.files.length > 0;
  if (needSecond) ok = ok && state.secondDept;
  document.getElementById('analyze-btn').disabled = !ok;
}

function fileToBase64(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function() { resolve(reader.result.split(',')[1]); };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.getElementById('analyze-btn').addEventListener('click', runAnalysis);
document.getElementById('reset-btn').addEventListener('click', function() {
  state = { year: null, dept: null, track: null, secondDept: null, files: [], autonomous: false };
  ['dd-year','dd-dept','dd-second'].forEach(function(id) {
    var dd = document.getElementById(id);
    dd.querySelectorAll('.dd-item').forEach(function(i) { i.classList.remove('selected','disabled'); });
    var trigger = dd.querySelector('.dd-trigger');
    var labels = {'dd-year':'학번 선택하기','dd-dept':'학과 선택하기','dd-second':'전공 선택하기'};
    trigger.querySelector('.dd-label').textContent = labels[id];
    trigger.classList.remove('has-val','open');
    dd.querySelector('.dd-list').classList.remove('open');
  });
  document.querySelectorAll('.option-btn').forEach(function(b) { b.classList.remove('selected'); });
  document.getElementById('previews').innerHTML = '';
  document.getElementById('result').style.display = 'none';
  document.getElementById('result').classList.remove('show');
  document.getElementById('loading').classList.remove('show');
  document.getElementById('track-info').style.display = 'none';
  document.getElementById('second-major-card').classList.remove('show');
  document.getElementById('autonomous-toggle').style.display = 'none';
  document.getElementById('autonomous-check').checked = false;
  document.getElementById('analyze-btn').disabled = true;
  ['step2','step3','step4'].forEach(function(id) { document.getElementById(id).classList.remove('visible'); });
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

['c1','c2','c3','c4'].forEach(function(id) { document.getElementById(id).addEventListener('input', calcCert); });
function calcCert() {
  var total = 0;
  ['c1','c2','c3','c4'].forEach(function(id) { total += parseInt(document.getElementById(id).value) || 0; });
  document.getElementById('cert-total').textContent = total;
  document.getElementById('cert-bar').style.width = Math.min(100, total) + '%';
  var msg = document.getElementById('cert-msg');
  if (total >= 100) { msg.textContent = '🎉 졸업인증 완료! 100점 달성했어요'; msg.style.color = 'rgba(190,255,140,0.9)'; }
  else { msg.textContent = '앞으로 ' + (100 - total) + '점 더 필요해요 — 책 한 권 읽으면 2점이에요 📚'; msg.style.color = 'rgba(255,255,255,0.4)'; }
}

// 전공 카드는 항상 이미지 base값 그대로
// 트랙별 추가 조건은 alerts에서 별도 안내
function calcMajorRequired(base) {
  return base;
}

async function runAnalysis() {
  document.getElementById('analyze-btn').disabled = true;
  var loading = document.getElementById('loading');
  loading.classList.add('show');
  var msgs = ['캡처에서 학점 정보를 읽는 중이에요...','이수구분별 학점을 계산하는 중이에요...','졸업 요건이랑 비교하는 중이에요...','결과를 정리하는 중이에요...'];
  var mi = 0;
  var lt = setInterval(function() {
    var el = document.getElementById('loading-text');
    if (el) el.textContent = msgs[mi++ % msgs.length];
  }, 1800);

  try {
    var imageContents = await Promise.all(state.files.map(async function(file) {
      var b64 = await fileToBase64(file);
      return { type: 'image', source: { type: 'base64', media_type: file.type || 'image/jpeg', data: b64 } };
    }));

    // ─── 프롬프트 ───
    // [핵심]: 전공_요구는 이미지에서 읽은 값 사용, 절대 48 하드코딩 금지
    // [핵심]: 핵심교양 분야별 이수학점은 0인 분야도 반드시 포함
    var prompt = [
      '이것은 국민대학교 on국민 앱의 "제1전공 이수현황 조회" 화면 캡처입니다.',
      '아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요.',
      '',
      '=== 읽기 규칙 ===',
      '',
      '[전공_요구]',
      '이미지 상단 표에서 "전공(전공선택,학부(과)기초)" 행의 이수요구학점(A열) 숫자를 그대로 읽으세요.',
      '학과마다 다르므로 절대로 임의의 숫자로 고정하지 마세요.',
      '',
      '[핵심교양_분야별] ★ 가장 중요 ★',
      '이미지의 핵심교양 표를 위에서 아래로 한 행씩 읽으세요.',
      '각 행의 분야명(예: 인문I, 인문II, 소통, 글로벌, 창의)과 그 행의 이수학점(B열) 숫자를 1:1로 대응시키세요.',
      '절대로 분야명과 숫자를 섞거나 다른 행의 값을 가져오지 마세요.',
      '이수학점이 0인 분야도 반드시 포함하고 0으로 기입하세요.',
      '예시: 이미지에 "창의 | 0" 이라고 보이면 → {"분야":"창의","이수학점":0}',
      '',
      '[basics]',
      '글쓰기/College English/English Conversation 각각의 이수여부 Y=true, N=false.',
      '',
      '=== 출력 JSON ===',
      '{',
      '  "summary": {',
      '    "기초교양_요구":숫자,"기초교양_이수":숫자,',
      '    "핵심교양_요구":숫자,"핵심교양_이수":숫자,',
      '    "자유교양_요구":숫자,"자유교양_이수":숫자,',
      '    "일반선택_요구":숫자,"일반선택_이수":숫자,',
      '    "전공_요구":숫자,"전공_이수":숫자,',
      '    "총계_요구":숫자,"총계_이수":숫자',
      '  },',
      '  "basics": {',
      '    "글쓰기_이수":true또는false,',
      '    "CollegeEnglish_이수":true또는false,',
      '    "EnglishConversation_이수":true또는false',
      '  },',
      '  "핵심교양_분야별": [',
      '    이미지에서 읽은 순서대로. 분야명과 이수학점을 1:1 매핑.',
      '    형식: {"분야":"이미지에서읽은분야명","이수학점":이미지에서읽은숫자}',
      '  ],',
      '  "mandatory": [',
      '    {"교과목명":"...","이수현황":"이수 또는 미이수"}',
      '  ]',
      '}'
    ].join('\n');

    // OpenAI 포맷으로 변환
    var openaiImages = imageContents.map(function(img) {
      return { type: 'image_url', image_url: { url: 'data:' + img.source.media_type + ';base64,' + img.source.data } };
    });

    var resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + import.meta.env.VITE_OPENAI_API_KEY },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1500,
        messages: [{ role: 'user', content: openaiImages.concat([{ type: 'text', text: prompt }]) }]
      })
    });

    var data = await resp.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('API 응답이 비어있어요: ' + JSON.stringify(data));
    }
    var raw = data.choices[0].message.content;
    var match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('JSON을 찾을 수 없어요. 응답: ' + raw.slice(0, 200));
    var parsed = JSON.parse(match[0]);

    // 이미지에서 읽은 전공_요구를 base로, 트랙 조건 반영
    var baseFromImage = (parsed.summary && parsed.summary['전공_요구']) ? parsed.summary['전공_요구'] : 48;
    var finalMajorRequired = calcMajorRequired(baseFromImage);

    clearInterval(lt);
    loading.classList.remove('show');

    renderResult(parsed, baseFromImage, finalMajorRequired);

  } catch(err) {
    clearInterval(lt);
    loading.innerHTML = '<div class="error-msg">분석 중 오류가 발생했어요 😥<br><span style="font-size:12px;color:var(--muted)">' + err.message + '</span></div>';
    document.getElementById('analyze-btn').disabled = false;
  }
}

// baseFromImage: 이미지에서 읽은 원래 전공_요구 (학과 기본값)
// finalMajorRequired: 트랙 조건 반영 후 실제 이수해야 할 전공학점
function renderResult(data, baseFromImage, finalMajorRequired) {
  var s = data.summary || {}, b = data.basics || {}, m = data.mandatory || [];
  var coreFields = data['핵심교양_분야별'] || [];
  var totalEarned = s['총계_이수'] || 0, totalRequired = s['총계_요구'] || 130;
  var pct = Math.min(100, Math.round(totalEarned / totalRequired * 100));

  document.getElementById('overall-pct').innerHTML = pct + '<span>%</span>';
  document.getElementById('overall-label').textContent =
    pct >= 100 ? '🎓 졸업을 축하해요!' : pct >= 70 ? '거의 다 왔어요! 조금만 더' :
    pct >= 50 ? '절반 넘었어요, 잘 가고 있어요' : '잘하고 있어요, 파이팅!';
  document.getElementById('overall-detail').innerHTML =
    '총 이수학점 ' + totalEarned + ' / ' + totalRequired + '학점 &nbsp;·&nbsp; 남은 학점 ' + Math.max(0, totalRequired - totalEarned) + '학점';
  document.getElementById('result-date').textContent = new Date().toLocaleDateString('ko-KR') + ' 기준';

  // 핵심교양: 분야별 3학점 이상 체크
  var coreFail = coreFields.filter(function(f) { return (f['이수학점'] || 0) < 3; });
  var coreByFieldOk = coreFields.length > 0 && coreFail.length === 0;
  var coreForceFail = coreFields.length > 0 && !coreByFieldOk;

  var majorEarned = s['전공_이수'] || 0;

  var cards = [
    {
      label: '전공 학점',
      earned: majorEarned,
      required: finalMajorRequired
    },
    { label: '기초교양', earned: s['기초교양_이수']||0, required: s['기초교양_요구']||13 },
    {
      label: '핵심교양',
      earned: s['핵심교양_이수']||0,
      required: s['핵심교양_요구']||15,
      forceOk: coreByFieldOk,
      forceFail: coreForceFail
    },
    { label: '자유교양', earned: s['자유교양_이수']||0, required: s['자유교양_요구']||2 },
    { label: '일반선택', earned: s['일반선택_이수']||0, required: s['일반선택_요구']||0 }
  ].filter(function(c) { return c.required > 0; });

  var grid = document.getElementById('cards-grid');
  grid.innerHTML = '';
  cards.forEach(function(c) {
    var ok = c.forceFail ? false : (c.forceOk || c.earned >= c.required);
    var cp = c.required > 0 ? Math.min(100, Math.round(c.earned / c.required * 100)) : 100;
    var cls = ok ? 'ok' : cp >= 60 ? 'warn' : 'danger';
    if (c.forceFail) cls = 'danger';
    var badge = ok ? '✓ 충족' : (c.forceFail ? '분야별 미충족' : (c.required - c.earned) + '학점 부족');
    var noteHtml = c.note ? '<div style="font-size:10px;color:var(--muted);margin-top:5px">' + c.note + '</div>' : '';
    grid.innerHTML += '<div class="stat-card ' + cls + '"><div class="stat-label">' + c.label + '</div><div class="stat-value ' + cls + '">' + c.earned + '<small> / ' + c.required + '</small></div><span class="stat-badge ' + cls + '">' + badge + '</span>' + noteHtml + '</div>';
  });

  var prog = document.getElementById('progress-section');
  prog.innerHTML = '';
  [
    { name: '전체 이수학점', e: totalEarned,           r: totalRequired },
    { name: '전공학점',      e: majorEarned,           r: finalMajorRequired },
    { name: '기초교양',      e: s['기초교양_이수']||0, r: s['기초교양_요구']||13 },
    { name: '핵심교양',      e: s['핵심교양_이수']||0, r: s['핵심교양_요구']||15 },
    { name: '일반선택',      e: s['일반선택_이수']||0, r: s['일반선택_요구']||0 }
  ].filter(function(row) { return row.r > 0; }).forEach(function(row) {
    var rp = Math.min(100, Math.round(row.e / row.r * 100));
    var rc = rp >= 100 ? 'ok' : rp >= 60 ? 'warn' : 'danger';
    prog.innerHTML += '<div class="prog-row"><div class="prog-meta"><span class="prog-name">' + row.name + '</span><span class="prog-nums">' + row.e + ' / ' + row.r + ' (' + rp + '%)</span></div><div class="prog-track"><div class="prog-fill ' + rc + '" style="width:' + rp + '%"></div></div></div>';
  });

  var alerts = document.getElementById('alerts-section');
  alerts.innerHTML = '';

  // ── 트랙별 안내 (맨 위) ──
  if (state.track === 'intensive') {
    var intensiveRequired = Math.max(baseFromImage + 18, 66);
    var intensiveShort = Math.max(0, intensiveRequired - majorEarned);
    var intensiveCls = intensiveShort === 0 ? 'ok' : 'danger';
    var intensiveIco = intensiveShort === 0 ? '✅' : '❌';
    var intensiveMsg = intensiveShort === 0
      ? '전공 ' + majorEarned + '학점 이수 — 심화전공 요건 충족'
      : '현재 전공 ' + majorEarned + '학점 → ' + intensiveRequired + '학점까지 ' + intensiveShort + '학점 더 필요해요';
    alerts.innerHTML += '<div class="alert-item ' + intensiveCls + '"><span class="alert-ico">' + intensiveIco + '</span><div class="alert-txt"><strong>심화전공 조건</strong><span>일반선택 18학점을 전공으로 채워야 해요 (최소 ' + intensiveRequired + '학점) — ' + intensiveMsg + '</span></div></div>';
  }

  if (state.track === 'minor') {
    var minorDeptName = state.secondDept ? deptNames[state.secondDept] : '선택한 학과';
    alerts.innerHTML += '<div class="alert-item warn"><span class="alert-ico">📌</span><div class="alert-txt"><strong>부전공 조건 — ' + minorDeptName + '</strong><span>일반선택 18학점을 ' + minorDeptName + ' 전공선택 과목으로 채워야 해요 — 제2전공 이수현황 캡처도 함께 올려주세요</span></div></div>';
  }

  if (state.track === 'double') {
    var doubleDeptName = state.secondDept ? deptNames[state.secondDept] : '선택한 학과';
    alerts.innerHTML += '<div class="alert-item warn"><span class="alert-ico">📌</span><div class="alert-txt"><strong>복수전공 조건 — ' + doubleDeptName + '</strong><span>' + doubleDeptName + '의 졸업요건을 별도로 모두 충족해야 해요 (제1전공과 최대 15학점 중복 인정) — 제2전공 이수현황 캡처도 함께 올려주세요</span></div></div>';
  }

  if (state.autonomous) {
    alerts.innerHTML += '<div class="alert-item warn"><span class="alert-ico">ℹ️</span><div class="alert-txt"><strong>자율전공 입학자 안내</strong><span>1학년 탐색과목의 전공 인정 여부는 학과에 별도로 확인이 필요해요</span></div></div>';
  }

  // 핵심교양 분야별 — 미충족만 표시
  if (coreFields.length > 0 && !coreByFieldOk) {
    coreFail.forEach(function(f) {
      alerts.innerHTML += '<div class="alert-item danger"><span class="alert-ico">❌</span><div class="alert-txt"><strong>핵심교양 [' + f['분야'] + '] 미충족</strong><span>현재 ' + (f['이수학점'] || 0) + '학점 — 분야별 3학점 이상 필요해요</span></div></div>';
    });
  }

  // 기초교양 필수 3과목 — 미이수만 표시
  [{name:'글쓰기',ok:b['글쓰기_이수']},{name:'College English',ok:b['CollegeEnglish_이수']},{name:'English Conversation',ok:b['EnglishConversation_이수']}].forEach(function(item) {
    if (!item.ok) {
      alerts.innerHTML += '<div class="alert-item danger"><span class="alert-ico">❌</span><div class="alert-txt"><strong>' + item.name + '</strong><span>미이수 — 기초교양 필수과목이에요, 반드시 들어야 해요</span></div></div>';
    }
  });

  // 필수과목 미이수
  m.forEach(function(item) {
    if (item['이수현황'] && item['이수현황'].includes('미이수')) {
      alerts.innerHTML += '<div class="alert-item danger"><span class="alert-ico">⚠️</span><div class="alert-txt"><strong>필수과목 미이수: ' + item['교과목명'] + '</strong><span>졸업 전에 반드시 이수해야 해요</span></div></div>';
    }
  });

  var result = document.getElementById('result');
  result.style.display = 'block';
  result.classList.add('show');
  setTimeout(function() { result.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
}

