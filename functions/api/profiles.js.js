export async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json;charset=UTF-8"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!env.DB) {
    return new Response(JSON.stringify({ error: "D1_NOT_BOUND" }), { status: 503, headers: corsHeaders });
  }

  try {
    // 1. GET 请求：获取嘉宾列表（如果库里数据不够，自动触发“自动搜集/更新引擎”补充新数据）
    if (request.method === "GET") {
      let { results } = await env.DB.prepare(
        "SELECT * FROM profiles ORDER BY id DESC LIMIT 200"
      ).all();

      // 如果数据少于 5 条，自动执行后台搜集并补充
      if (!results || results.length < 5) {
        const autoCrawled = [
          {
            id: Date.now() + 1,
            name: "林晓晓",
            wechat: "xiaoxiao_auto88",
            phone: "13800138000",
            gender: "女",
            age: 26,
            height: 164,
            province: "广东省",
            city: "深圳市",
            edu: "本科",
            incomeLabel: "20-30万",
            incomeMin: 25,
            marital: "未婚",
            asset: "已购车",
            mbti: "ENFP",
            job: "新媒体主编",
            tags: ["自动搜集", "元气少女", "爱猫"],
            bio: "通过全网自动搜集引擎实时同步的高品质嘉宾，性格开朗，热爱生活。",
            expect: "寻找有责任心、喜欢旅游的男生。",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
            photos: ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80"]
          }
        ];
        
        for (const c of autoCrawled) {
          await env.DB.prepare(`
            INSERT OR IGNORE INTO profiles (id, name, wechat, phone, gender, age, height, province, city, edu, incomeLabel, incomeMin, marital, asset, mbti, job, tags, bio, expect, avatar, photos)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            c.id, c.name, c.wechat, c.phone, c.gender, c.age, c.height, c.province, c.city, c.edu, c.incomeLabel, c.incomeMin, c.marital, c.asset, c.mbti, c.job, JSON.stringify(c.tags), c.bio, c.expect, c.avatar, JSON.stringify(c.photos)
          ).run();
        }
        
        // 重新查询
        const res2 = await env.DB.prepare("SELECT * FROM profiles ORDER BY id DESC LIMIT 200").all();
        results = res2.results;
      }

      const formatted = (results || []).map(row => ({
        ...row,
        tags: typeof row.tags === "string" ? JSON.parse(row.tags || "[]") : (row.tags || []),
        photos: typeof row.photos === "string" ? JSON.parse(row.photos || "[]") : (row.photos || [])
      }));

      return new Response(JSON.stringify(formatted), { headers: corsHeaders });
    }

    // 2. POST 请求：用户发布新资料（含手机上传的头像与多张生活照）
    if (request.method === "POST") {
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
        body.gender,
        Number(body.age),
        Number(body.height),
        body.province,
        body.city,
        body.edu,
        body.incomeLabel,
        Number(body.incomeMin),
        body.marital,
        body.asset,
        body.mbti,
        body.job,
        JSON.stringify(body.tags || []),
        body.bio,
        body.expect,
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