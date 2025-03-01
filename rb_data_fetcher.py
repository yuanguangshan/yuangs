import requests
import datetime
from typing import Optional

def fetch_rb_data(contract_code: str, date: Optional[str] = None) -> dict:
    """获取RB期货数据
    
    Args:
        contract_code: 合约代码，如'RB2505'
        date: 日期字符串，格式为'YYYY-MM-DD'，默认为当天
        
    Returns:
        dict: 包含期货数据的字典
    """
    # 如果没有提供日期，使用当天日期
    if date is None:
        date = datetime.datetime.now().strftime('%Y-%m-%d')
        
    # 构建请求URL
    base_url = 'https://py.want.biz/ranking/RB'
    url = f'{base_url}/{contract_code}/{date}'
    
    try:
        # 发送GET请求
        response = requests.get(url)
        response.raise_for_status()  # 检查请求是否成功
        
        # 返回JSON数据
        return response.json()
        
    except requests.RequestException as e:
        print(f'请求数据时发生错误: {e}')
        return {}

def main():
    # 示例：获取RB2505合约的数据
    contract_code = 'RB2505'
    date = '2025-02-28'
    
    data = fetch_rb_data(contract_code, date)
    print(f'获取到的{contract_code}合约在{date}的数据：')
    print(data)

if __name__ == '__main__':
    main()