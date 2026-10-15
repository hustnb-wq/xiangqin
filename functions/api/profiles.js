export async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json;charset=UTF-8"
  };

  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (!env.DB) return new Response(JSON.stringify({ error: "D1_NOT_BOUND" }), { status: 503, headers: corsHeaders });

  // 12位各不相同的全国初始高质量嘉宾库（固定ID防重复）
  const seedProfiles = [
    { id: 101, name: "苏晚晴", wechat: "suwanqing_sh99", phone: "13816889901", gender: "女", age: 27, height: 165, province: "上海市", city: "徐汇区", edu: "硕士", incomeLabel: "20-30万", incomeMin: 25, marital: "未婚", asset: "已购房", mbti: "INFJ", job: "高校行政 / 艺术策展", tags: ["海归硕士", "喜欢做饭", "猫奴", "情绪稳定"], bio: "性格温和慢热，熟悉之后很爱笑。平时喜欢逛美术馆、烘焙和周末徒步，生活规律不熬夜。", expect: "希望你在江浙沪定居，26-34岁之间，本科及以上学历，有责任心。", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80", photos: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80"] },
    { id: 102, name: "陈叙白", wechat: "chenxubai_ai", phone: "13910992233", gender: "男", age: 30, height: 180, province: "北京市", city: "海淀区", edu: "硕士", incomeLabel: "50万以上", incomeMin: 55, marital: "未婚", asset: "已购房有车", mbti: "INTJ", job: "AI大模型算法工程师", tags: ["985硕士", "有房有车", "羽毛球控", "不烟不酒"], bio: "理工科背景但平时喜欢看人文历史类书籍，每周坚持三次羽毛球和跑步。已经做好进入婚姻家庭的准备。", expect: "期待遇到一位善良开朗、三观相近的女生，一起探索美食与生活。", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80", photos: ["https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80"] },
    { id: 103, name: "林知夏", wechat: "zhixia_design", phone: "15857126688", gender: "女", age: 26, height: 163, province: "浙江省", city: "杭州市", edu: "本科", incomeLabel: "20-30万", incomeMin: 25, marital: "未婚", asset: "已购车", mbti: "ENFP", job: "独立插画师 / UI设计师", tags: ["江南女生", "热爱旅行", "摄影达人"], bio: "典型ENFP快乐小狗性格，对生活充满好奇心。工作时间比较自由，擅长发现生活里的小确幸。", expect: "希望你身高173cm以上，情绪稳定、有幽默感，喜欢大自然或小动物。", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"] },
    { id: 104, name: "顾言深", wechat: "guyanshen_sz", phone: "18675509988", gender: "男", age: 33, height: 178, province: "广东省", city: "深圳市", edu: "硕士", incomeLabel: "50万以上", incomeMin: 55, marital: "未婚", asset: "已购房有车", mbti: "ENTJ", job: "新能源行业产品总监", tags: ["事业稳定", "擅长煲汤", "自驾游控"], bio: "来深圳打拼7年已扎根安家。虽然工作节奏快，但周末一定留给生活，拿手菜是红烧肉和广式煲汤。", expect: "希望找一位在广东省内发展的女生，25-32岁，看重相处时的松弛感与互相支持。", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80", photos: [] },
    { id: 105, name: "许清欢", wechat: "dr_xuqinghuan", phone: "13540087766", gender: "女", age: 29, height: 168, province: "四川省", city: "成都市", edu: "博士", incomeLabel: "30-50万", incomeMin: 35, marital: "未婚", asset: "已购房有车", mbti: "ISFJ", job: "三甲医院主治医师", tags: ["医学博士", "温柔知性", "喜欢网球"], bio: "平时工作严谨认真，私下是个喜欢探店、打网球和听音乐剧的普通女孩。父母开明，家庭氛围和睦。", expect: "希望对方工作稳定、有上进心，两个人能成为彼此最坚实的后盾。", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80", photos: [] },
    { id: 106, name: "周亦航", wechat: "zhouyihang_su", phone: "13776003344", gender: "男", age: 34, height: 182, province: "江苏省", city: "苏州市", edu: "本科", incomeLabel: "30-50万", incomeMin: 35, marital: "离异未育", asset: "已购房有车", mbti: "ISTJ", job: "外企供应链经理", tags: ["成熟稳重", "咖啡发烧友", "滑雪爱好者"], bio: "性格随和踏实，对婚姻和经营家庭有成熟的理解。平时喜欢手冲咖啡和户外露营。", expect: "看重人品真诚、沟通顺畅，愿意一起踏实过好未来的小日子。", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80", photos: [] },
    { id: 201, name: "徐晓曼", wechat: "xiaoman_sz88", phone: "13622334455", gender: "女", age: 26, height: 167, province: "广东省", city: "深圳市", edu: "本科", incomeLabel: "20-30万", incomeMin: 25, marital: "未婚", asset: "已购车", mbti: "ENFP", job: "大厂品牌公关 / 资深策划", tags: ["元气少女", "爱笑", "周末露营控", "粤语流利"], bio: "出生于教师家庭，性格开朗外向，充满正能量。工作之余喜欢飞盘、露营和尝试各种手作。", expect: "希望你在深圳或广州工作，身高175cm以上，阳光开朗有担当。", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80", photos: ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80"] },
    { id: 202, name: "傅云霆", wechat: "yunting_bj2026", phone: "18511223344", gender: "男", age: 31, height: 183, province: "北京市", city: "朝阳区", edu: "硕士", incomeLabel: "50万以上", incomeMin: 55, marital: "未婚", asset: "已购房有车", mbti: "ENTJ", job: "外资律所资深律师", tags: ["清华硕士", "有房有车", "健身达人", "声音磁性"], bio: "理性沉稳，工作严谨但私下很好相处。平时喜欢普拉提、网球和交响音乐会。", expect: "希望你知性优雅，有自己的职业追求和生活情趣，在京津冀发展。", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80", photos: [] },
    { id: 203, name: "沈之远", wechat: "yuandev_hz", phone: "13958001122", gender: "男", age: 28, height: 178, province: "浙江省", city: "杭州市", edu: "本科", incomeLabel: "30-50万", incomeMin: 35, marital: "未婚", asset: "已购房", mbti: "INTP", job: "互联网高级技术专家", tags: ["滨江新贵", "猫奴", "独立音乐", "会做红烧肉"], bio: "标准理工男的外表下有一颗文艺的心，酷爱吉他和黑胶唱片。在杭州有独立住房，情绪价值拉满。", expect: "期待遇见温柔善良、懂得生活小情调的女生，最好也在杭城发展。", avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80", photos: [] },
    { id: 204, name: "唐诗语", wechat: "shiyu_cdteacher", phone: "15881112233", gender: "女", age: 25, height: 162, province: "四川省", city: "成都市", edu: "本科", incomeLabel: "10-20万", incomeMin: 15, marital: "未婚", asset: "已购车", mbti: "ESFJ", job: "重点小学语文老师", tags: ["编制教师", "书香门第", "甜美温柔", "擅长烹饪"], bio: "标准的巴蜀温柔乖巧女生，声音轻柔，极有耐心。周末喜欢看书、插花和做川菜。", expect: "希望你在成都稳定工作，有责任感、孝顺父母，身高172cm以上。", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80", photos: [] },
    { id: 205, name: "韩嘉誉", wechat: "jiayuhan_sh", phone: "13588990011", gender: "男", age: 29, height: 181, province: "上海市", city: "浦东新区", edu: "硕士", incomeLabel: "30-50万", incomeMin: 45, marital: "未婚", asset: "已购房有车", mbti: "ENFJ", job: "外资药企产品经理", tags: ["陆家嘴工作", "阳光健谈", "马拉松爱好者"], bio: "性格开朗，极具同理心。业余爱好是长跑和交友，每年会参加两次半马。无不良嗜好。", expect: "希望找一位在上海工作、热爱生活的女生，24-30岁之间。", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80", photos: [] },
    { id: 206, name: "叶灵儿", wechat: "ling_gzfinance", phone: "13711223388", gender: "女", age: 27, height: 164, province: "广东省", city: "广州市", edu: "硕士", incomeLabel: "20-30万", incomeMin: 28, marital: "未婚", asset: "已购房", mbti: "ESTJ", job: "券商投行分析师", tags: ["独立自信", "会理财", "普拉提达人"], bio: "做事干练有条理，对生活品质有要求。周末喜欢去珠江边散步、看画展或研究健康轻食。", expect: "希望对方有上进心、经济独立、情绪价值高。", avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80", photos: [] }
  ];

  // 动态爬虫候选池（用于点击“一键全网搜集”或定时扩充）
  const crawlTemplates = [
    { name: "温如玉", gender: "女", age: 25, height: 166, province: "湖北省", city: "武汉市", edu: "硕士", incomeLabel: "10-20万", incomeMin: 18, marital: "未婚", asset: "已购车", mbti: "ISFP", job: "高校辅导员", tags: ["体制内", "温柔体贴", "古筝十级"], bio: "自幼学习民族乐器，性格温婉安静，喜欢汉服与茶艺。", expect: "寻觅一位在武汉发展、稳重踏实的男生。", avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=600&q=80" },
    { name: "陆星河", gender: "男", age: 29, height: 184, province: "陕西省", city: "西安市", edu: "硕士", incomeLabel: "30-50万", incomeMin: 35, marital: "未婚", asset: "已购房有车", mbti: "ENTP", job: "航天科研院所工程师", tags: ["科研精英", "幽默风趣", "篮球控"], bio: "工作稳定福利好，有独立婚房。平时喜欢研究数码产品、打篮球和自驾秦岭。", expect: "希望你活泼可爱，愿意一起尝遍天下美食。", avatar: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&w=600&q=80" },
    { name: "白芷若", gender: "女", age: 28, height: 168, province: "重庆市", city: "江北区", edu: "本科", incomeLabel: "20-30万", incomeMin: 24, marital: "未婚", asset: "已购房", mbti: "ENFJ", job: "涉外建筑设计师", tags: ["川渝辣妹", "颜值在线", "滑雪控"], bio: "既有重庆妹子的爽朗耿直，也有细腻温柔的一面。已经在江北嘴买房定居。", expect: "希望你有主见、爱运动、不冷暴力。", avatar: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" },
    { name: "宋景行", gender: "男", age: 32, height: 179, province: "湖南省", city: "长沙市", edu: "博士", incomeLabel: "30-50万", incomeMin: 40, marital: "未婚", asset: "已购房有车", mbti: "INTJ", job: "湘雅医院外科医生", tags: ["医学博士", "有房有车", "做饭好吃"], bio: "外科医生手很稳，回家做湘菜也很拿手。平时作息规律，无任何不良嗜好。", expect: "希望能遇到一位善解人意、互相体谅的伴侣。", avatar: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&w=600&q=80" },
    { name: "姜知意", gender: "女", age: 24, height: 164, province: "山东省", city: "青岛市", edu: "本科", incomeLabel: "10-20万", incomeMin: 15, marital: "未婚", asset: "已购车", mbti: "ESFP", job: "跨境电商主理人", tags: ["海边女孩", "创业新秀", "烘焙达人"], bio: "喜欢吹着海风喝咖啡，自己经营一家小而美的跨境家居店铺，时间自由。", expect: "期待阳光帅气、有共同话题的男生。", avatar: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=600&q=80" }
  ];

  try {
    const url = new URL(request.url);

    // 1. GET 请求：清理旧重复数据并确保至少有12位丰富嘉宾
    if (request.method === "GET") {
      // 自动清理之前重复插入的“林晓晓”
      await env.DB.prepare("DELETE FROM profiles WHERE name = '林晓晓'").run();

      let { results } = await env.DB.prepare("SELECT * FROM profiles ORDER BY id DESC LIMIT 200").all();

      // 如果数据库少于 10 人，自动将 12 位精品初始嘉宾补齐到 D1
      if (!results || results.length < 10) {
        for (const c of seedProfiles) {
          await env.DB.prepare(`
            INSERT OR REPLACE INTO profiles (
              id, name, wechat, phone, gender, age, height, province, city,
              edu, incomeLabel, incomeMin, marital, asset, mbti, job,
              tags, bio, expect, avatar, photos
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            c.id, c.name, c.wechat, c.phone, c.gender, c.age, c.height, c.province, c.city,
            c.edu, c.incomeLabel, c.incomeMin, c.marital, c.asset, c.mbti, c.job,
            JSON.stringify(c.tags), c.bio, c.expect, c.avatar, JSON.stringify(c.photos)
          ).run();
        }
        const resAfter = await env.DB.prepare("SELECT * FROM profiles ORDER BY id DESC LIMIT 200").all();
        results = resAfter.results;
      }

      const formatted = (results || []).map(row => ({
        ...row,
        tags: typeof row.tags === "string" ? JSON.parse(row.tags || "[]") : (row.tags || []),
        photos: typeof row.photos === "string" ? JSON.parse(row.photos || "[]") : (row.photos || [])
      }));

      return new Response(JSON.stringify(formatted), { headers: corsHeaders });
    }

    // 2. POST 请求：支持【手动/自动触发爬虫搜集】或【用户发布新相亲卡】
    if (request.method === "POST") {
      const action = url.searchParams.get("action");

      // 分支 A：触发全网自动搜集引擎，每次入库 2 位新嘉宾
      if (action === "crawl") {
        const picked = [];
        for (let i = 0; i < 2; i++) {
          const tpl = crawlTemplates[Math.floor(Math.random() * crawlTemplates.length)];
          const randSuffix = Math.floor(100 + Math.random() * 899);
          const newItem = {
            ...tpl,
            id: Date.now() + i,
            name: `${tpl.name}`,
            wechat: `wx_${tpl.mbti.toLowerCase()}_${randSuffix}`,
            phone: `138${Math.floor(10000000 + Math.random() * 89999999)}`,
            tags: ["⚡全网搜集", ...tpl.tags],
            photos: []
          };
          await env.DB.prepare(`
            INSERT INTO profiles (
              id, name, wechat, phone, gender, age, height, province, city,
              edu, incomeLabel, incomeMin, marital, asset, mbti, job,
              tags, bio, expect, avatar, photos
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            newItem.id, newItem.name, newItem.wechat, newItem.phone, newItem.gender,
            newItem.age, newItem.height, newItem.province, newItem.city,
            newItem.edu, newItem.incomeLabel, newItem.incomeMin, newItem.marital,
            newItem.asset, newItem.mbti, newItem.job,
            JSON.stringify(newItem.tags), newItem.bio, newItem.expect,
            newItem.avatar, JSON.stringify(newItem.photos)
          ).run();
          picked.push(newItem);
        }
        return new Response(JSON.stringify({ success: true, added: picked }), { headers: corsHeaders });
      }

      // 分支 B：真实用户上传照片并发布资料卡
      const body = await request.json();
      await env.DB.prepare(`
        INSERT INTO profiles (
          id, name, wechat, phone, gender, age, height, province, city,
          edu, incomeLabel, incomeMin, marital, asset, mbti, job,
          tags, bio, expect, avatar, photos
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        body.id || Date.now(),
        body.name,
        body.wechat,
        body.phone || "",
        body.gender || "女",
        Number(body.age || 26),
        Number(body.height || 165),
        body.province || "广东省",
        body.city || "深圳市",
        body.edu || "本科",
        body.incomeLabel || "20-30万",
        Number(body.incomeMin || 25),
        body.marital || "未婚",
        body.asset || "已购车",
        body.mbti || "ENFP",
        body.job || "都市白领",
        JSON.stringify(body.tags || ["实名认证"]),
        body.bio || "",
        body.expect || "寻觅真诚有缘人",
        body.avatar || "",
        JSON.stringify(body.photos || [])
      ).run();

      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
}
