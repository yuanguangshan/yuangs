import pygame
import math
import random
import time
import os

# 游戏初始化
pygame.init()
pygame.mixer.init()

# 加载音效
SOUND_DIR = os.path.join(os.path.dirname(__file__), 'sounds')
if not os.path.exists(SOUND_DIR):
    os.makedirs(SOUND_DIR)

# 创建音效文件
ATTACK_SOUND = os.path.join(SOUND_DIR, 'attack.wav')
HIT_SOUND = os.path.join(SOUND_DIR, 'hit.wav')
ULTIMATE_SOUND = os.path.join(SOUND_DIR, 'ultimate.wav')

# 生成简单的音效（如果文件不存在）
def create_sound_file(filename, frequency, duration):
    if not os.path.exists(filename):
        sample_rate = 44100
        t = numpy.linspace(0, duration, int(sample_rate * duration))
        wave_data = numpy.sin(2 * numpy.pi * frequency * t)
        wave_data = numpy.int16(wave_data * 32767)
        with wave.open(filename, 'wb') as f:
            f.setnchannels(1)
            f.setsampwidth(2)
            f.setframerate(sample_rate)
            f.writeframes(wave_data.tobytes())

# 加载或创建音效
try:
    attack_sound = pygame.mixer.Sound(ATTACK_SOUND)
    hit_sound = pygame.mixer.Sound(HIT_SOUND)
    ultimate_sound = pygame.mixer.Sound(ULTIMATE_SOUND)
except:
    import numpy
    import wave
    create_sound_file(ATTACK_SOUND, 440, 0.1)  # 攻击音效
    create_sound_file(HIT_SOUND, 220, 0.2)     # 受击音效
    create_sound_file(ULTIMATE_SOUND, 880, 0.3) # 终极技能音效
    attack_sound = pygame.mixer.Sound(ATTACK_SOUND)
    hit_sound = pygame.mixer.Sound(HIT_SOUND)
    ultimate_sound = pygame.mixer.Sound(ULTIMATE_SOUND)
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("哪吒大冒险")
clock = pygame.time.Clock()

# 哪吒初始位置
哪吒_x = 100
哪吒_y = height / 2
哪吒_speed = 5
哪吒血量 = 10

# 敖丙信息，初始不出现（设为 None）
敖丙 = None
敖丙_speed = 3
# 控制敖丙攻击的计数器
attack_counter = 0
attack_interval = 60  # 每 60 帧（可根据情况调整）发射一次冰锤

# 火尖枪列表
火尖枪_list = []
火尖枪_speed = 10

# 乾坤圈列表，增加一个角度属性用于旋转，初始化为六个乾坤圈
乾坤圈_list = [
    [哪吒_x + 10 - 10 / 2,  # 假设每个像素大小为 10，这里为了视觉效果调整
     哪吒_y + 10 / 2 - 10 / 2, angle]
    for angle in range(0, 360, 60)  # 每隔 60 度放置一个乾坤圈
]
乾坤圈_speed = 8

# 混天绫列表，假设初始为空
混天绫_list = []
# 混天绫的长度和速度
混天绫_length = 100
混天绫_speed = 6

# 九龙盖火罩列表
九龙盖火罩_list = []
九龙盖火罩_duration = 20

# 冰锤列表
冰锤_list = []
冰锤_speed = 5

# 小怪列表，每个小怪元素格式为 [x, y, 攻击计数器, 是否发射宝剑, 宝剑位置x, 宝剑位置y, 血量]
小怪_list = []
小怪_speed = 3
# 控制小怪攻击的计数器和间隔
小怪_attack_counter = 0
小怪_attack_interval = 120  # 每 120 帧（可根据情况调整）发射一次宝剑

# 记录上一次释放九龙盖火罩的时间
last_ultimate_time = 0
ultimate_interval = 5 * 60  # 5 秒钟，按 60 帧/秒计算

# 游戏主循环
running = True
while running:
    current_time = pygame.time.get_ticks()  # 获取当前时间（毫秒）
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:  # 鼠标左键点击发射火尖枪
                # 获取鼠标位置
                mouse_x, _ = pygame.mouse.get_pos()
                # 计算火尖枪发射方向
                dx = mouse_x - (哪吒_x + 10 / 2)
                dy = 0
                length = math.sqrt(dx ** 2 + dy ** 2)
                if length > 0:
                    dx /= length
                    dy /= length
                # 发射火尖枪
                火尖枪_x = 哪吒_x + 10 / 2
                火尖枪_y = 哪吒_y + 10 / 2
                attack_sound.play()
            火尖枪_list.append([火尖枪_x, 火尖枪_y, dx * 火尖枪_speed, dy * 火尖枪_speed])

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT] and 哪吒_x > 0:
        哪吒_x -= 哪吒_speed
    elif keys[pygame.K_RIGHT] and 哪吒_x < width - 10:
        哪吒_x += 哪吒_speed
    elif keys[pygame.K_RETURN]:  # 按下回车键释放九龙盖火罩
        if current_time - last_ultimate_time >= ultimate_interval:
            九龙盖火罩_x = 哪吒_x + 10 / 2 - 10 / 2
            九龙盖火罩_y = 哪吒_y + 10 / 2 - 10 / 2
            ultimate_sound.play()
            九龙盖火罩_list.append([九龙盖火罩_x, 九龙盖火罩_y, 九龙盖火罩_duration])
            last_ultimate_time = current_time

    # 创建敖丙（如果当前没有敖丙）
    if not 敖丙 and random.randint(1, 100) < 5:
        敖丙_x = width - 10
        敖丙_y = height / 2
        敖丙 = [敖丙_x, 敖丙_y, 10]

        # 游戏难度随时间增加
    game_time = current_time / 1000  # 转换为秒
    difficulty_multiplier = 1 + game_time / 60  # 每分钟增加1倍难度
    
    # 随机生成小怪，生成概率随难度增加
    spawn_chance = min(30, 10 * difficulty_multiplier)  # 最大30%概率
    if 敖丙 and random.randint(1, 100) < spawn_chance:
        x = random.randint(敖丙[0], 敖丙[0] + 10)
        y = random.randint(int(敖丙[1]), int(敖丙[1]) + 10)
        小怪_health = min(3, int(difficulty_multiplier))  # 小怪血量随难度增加
        小怪_list.append([x, y, 0, False, 0, 0, 小怪_health])

    # 控制敖丙自动攻击
    if 敖丙:
        attack_counter += 1
        if attack_counter >= attack_interval:
            冰锤_x = 敖丙[0] + 10 / 2 - 10 / 2
            冰锤_y = 敖丙[1] + 10 / 2 - 10 / 2
            冰锤_list.append([冰锤_x, 冰锤_y])
            attack_counter = 0

    # 控制小怪自动攻击
    小怪_attack_counter += 1
    if 小怪_attack_counter >= 小怪_attack_interval:
        for 小怪 in 小怪_list:
            if not 小怪[3]:  # 如果小怪还没有发射宝剑
                # 计算宝剑发射方向
                dx = 哪吒_x - 小怪[0]
                dy = 哪吒_y - 小怪[1]
                length = math.sqrt(dx ** 2 + dy ** 2)
                if length > 0:
                    dx /= length
                    dy /= length
                小怪[4] = 小怪[0] + 10 / 2
                小怪[5] = 小怪[1] + 10 / 2
                小怪[3] = True  # 设置为已发射宝剑
        小怪_attack_counter = 0

    # 火尖枪移动
    for 火尖枪 in 火尖枪_list:
        火尖枪[0] += 火尖枪[2]
        火尖枪[1] += 火尖枪[3]
        if (火尖枪[0] < 0 or 火尖枪[0] > width or
            火尖枪[1] < 0 or 火尖枪[1] > height):
            火尖枪_list.remove(火尖枪)

    # 乾坤圈围绕哪吒旋转
    for 乾坤圈 in 乾坤圈_list:
        radius = 50
        angle = 乾坤圈[2] * (math.pi / 180)
        乾坤圈[0] = 哪吒_x + 10 / 2 + radius * math.cos(angle)
        乾坤圈[1] = 哪吒_y + 10 / 2 + radius * math.sin(angle)
        乾坤圈[2] += 5

    # 混天绫逻辑，假设从哪吒位置发射并移动
    if random.randint(1, 100) < 5:  # 随机概率发射混天绫
        start_x = 哪吒_x + 10 / 2
        start_y = 哪吒_y + 10 / 2
        direction_x = random.choice([-1, 1])
        direction_y = random.choice([-1, 1])
        混天绫_list.append([start_x, start_y, direction_x, direction_y, 0])

    for 混天绫 in 混天绫_list:
        混天绫[0] += 混天绫[2] * 混天绫_speed
        混天绫[1] += 混天绫[3] * 混天绫_speed
        混天绫[4] += 1
        if 混天绫[4] >= 混天绫_length:
            混天绫_list.remove(混天绫)

    # 九龙盖火罩处理
    for 九龙盖火罩 in 九龙盖火罩_list:
        九龙盖火罩[2] -= 1
        if 九龙盖火罩[2] <= 0:
            九龙盖火罩_list.remove(九龙盖火罩)

    # 冰锤移动
    for 冰锤 in 冰锤_list:
        冰锤[0] -= 冰锤_speed
        if 冰锤[0] < -10:
            冰锤_list.remove(冰锤)

    # 小怪移动
    for 小怪 in 小怪_list:
        小怪[0] -= 小怪_speed
        if 小怪[0] < -10:
            小怪_list.remove(小怪)

    # 处理小怪发射的宝剑移动和碰撞检测
    for 小怪 in 小怪_list:
        if 小怪[3]:  # 如果小怪已发射宝剑
            小怪[4] += (哪吒_x - 小怪[0]) / 10  # 简单的朝向哪吒移动
            小怪[5] += (哪吒_y - 小怪[1]) / 10
            # 检查宝剑是否击中哪吒
            if (
                小怪[4] < 哪吒_x + 10
                and 小怪[4] + 10 > 哪吒_x
                and 小怪[5] < 哪吒_y + 10
                and 小怪[5] + 10 > 哪吒_y
            ):
                哪吒血量 -= 1
                if 哪吒血量 <= 0:
                    running = False
                小怪[3] = False  # 重置宝剑状态
            # 检查宝剑是否超出屏幕边界
            elif (
                小怪[4] < 0 or 小怪[4] > width or
                小怪[5] < 0 or 小怪[5] > height
            ):
                小怪[3] = False  # 重置宝剑状态

    # 检查乾坤圈是否对小怪造成伤害
    for 乾坤圈 in 乾坤圈_list:
        for 小怪 in 小怪_list:
            # 简单的距离判断，这里假设距离小于 30 认为是附近
            distance = math.sqrt((乾坤圈[0] - 小怪[0]) ** 2 + (乾坤圈[1] - 小怪[1]) ** 2)
            if distance < 30:
                小怪[6] -= 2
                if 小怪[6] <= 0:
                    小怪_list.remove(小怪)

    # 检查火尖枪是否击中敖丙
    if 敖丙:
        for 火尖枪 in 火尖枪_list:
            if (
                火尖枪[0] < 敖丙[0] + 10
                and 火尖枪[0] + 10 > 敖丙[0]
                and 火尖枪[1] < 敖丙[1] + 10
                and 火尖枪[1] + 10 > 敖丙[1]
            ):
                hit_sound.play()
                敖丙[2] -= 1
                if 敖丙[2] <= 0:
                    敖丙 = None
                火尖枪_list.remove(火尖枪)

    # 检查九龙盖火罩是否击中敖丙
    if 敖丙:
        for 九龙盖火罩 in 九龙盖火罩_list:
            if (
                九龙盖火罩[0] < 敖丙[0] + 10
                and 九龙盖火罩[0] + 10 > 敖丙[0]
                and 九龙盖火罩[1] < 敖丙[1] + 10
                and 九龙盖火罩[1] + 10 > 敖丙[1]
            ):
                敖丙[2] -= 3
                if 敖丙[2] <= 0:
                    敖丙 = None

    # 检查冰锤是否击中哪吒
    for 冰锤 in 冰锤_list:
        if (
            冰锤[0] < 哪吒_x + 10
            and 冰锤[0] + 10 > 哪吒_x
            and 冰锤[1] < 哪吒_y + 10
            and 冰锤[1] + 10 > 哪吒_y
        ):
            哪吒血量 -= 1
            if 哪吒血量 <= 0:
                running = False
            冰锤_list.remove(冰锤)

    # 检查火尖枪是否击中小怪
    for 火尖枪 in 火尖枪_list:
        for 小怪 in 小怪_list:
            if (
                火尖枪[0] < 小怪[0] + 10
                and 火尖枪[0] + 10 > 小怪[0]
                and 火尖枪[1] < 小怪[1] + 10
                and 火尖枪[1] + 10 > 小怪[1]
            ):
                小怪_list.remove(小怪)
                火尖枪_list.remove(火尖枪)

    # 检查九龙盖火罩是否击中小怪
    for 九龙盖火罩 in 九龙盖火罩_list:
        for 小怪 in 小怪_list:
            if (
                九龙盖火罩[0] < 小怪[0] + 10
                and 九龙盖火罩[0] + 10 > 小怪[0]
                and 九龙盖火罩[1] < 小怪[1] + 10
                and 九龙盖火罩[1] + 10 > 小怪[1]
            ):
                小怪_list.remove(小怪)

    if 敖丙:
        敖丙[0] -= 敖丙_speed
        if 敖丙[0] < -10:
            敖丙 = None

    screen.fill((0, 0, 0))

    # 绘制UI界面
    # 血量条背景
    pygame.draw.rect(screen, (255, 0, 0), (10, 10, 200, 20))
    # 血量条
    pygame.draw.rect(screen, (0, 255, 0), (10, 10, 200 * (哪吒血量 / 10), 20))
    
    # 技能冷却显示
    ultimate_cooldown = (current_time - last_ultimate_time) / ultimate_interval
    if ultimate_cooldown > 1:
        ultimate_cooldown = 1
    pygame.draw.rect(screen, (100, 100, 100), (10, 40, 100, 10))
    pygame.draw.rect(screen, (0, 255, 255), (10, 40, 100 * ultimate_cooldown, 10))

    # 绘制得分
    font = pygame.font.Font(None, 36)
    score_text = font.render(f'得分: {len(小怪_list)}', True, (255, 255, 255))
    screen.blit(score_text, (width - 150, 10))

    # 绘制哪吒（红色像素）
    pygame.draw.rect(screen, (255, 0, 0), (哪吒_x, 哪吒_y, 10, 10))

    if 敖丙:
        # 绘制敖丙（蓝色像素）
        pygame.draw.rect(screen, (0, 0, 255), (敖丙[0], 敖丙[1], 10, 10))

    for 火尖枪 in 火尖枪_list:
        pygame.draw.rect(screen, (255, 255, 255), (火尖枪[0], 火尖枪[1], 10, 10))

    for 乾坤圈 in 乾坤圈_list:
        pygame.draw.rect(screen, (255, 255, 0), (乾坤圈[0], 乾坤圈[1], 10, 10))

    for 九龙盖火罩 in 九龙盖火罩_list:
        pygame.draw.circle(screen, (255, 165, 0), (int(九龙盖火罩[0]), int(九龙盖火罩[1])), 10)

    for 冰锤 in 冰锤_list:
        pygame.draw.rect(screen, (255, 255, 255), (冰锤[0], 冰锤[1], 10, 10))

    for 小怪 in 小怪_list:
        pygame.draw.rect(screen, (100, 100, 100), (小怪[0], 小怪[1], 10, 10))
        if 小怪[3]:
            pygame.draw.rect(screen, (0, 0, 0), (小怪[4], 小怪[5], 10, 10))

    for 混天绫 in 混天绫_list:
        pygame.draw.line(screen, (255, 165, 0), (混天绫[0], 混天绫[1]),
                         (混天绫[0] + 混天绫[2] * 混天绫_length, 混天绫[1] + 混天绫[3] * 混天绫_length), 10)

    pygame.display.flip()
    clock.tick(60)

pygame.quit()