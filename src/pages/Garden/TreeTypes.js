/**
 * Tree Types Definition with realistic styling
 * 10+ tree types for diverse customization
 */

export const TREE_TYPES = {
  rose: {
    name: 'Hoa Hồng',
    emoji: '🌹',
    description: 'Hoa hồng kinh điển',
    colors: ['#FF1493', '#FF69B4', '#FFB6C1', '#DC143C', '#C71585'],
    defaultColor: '#FF1493',
    leafColors: ['#228B22', '#32CD32', '#3CB371'],
  },
  lavender: {
    name: 'Lavender',
    emoji: '💜',
    description: 'Hoa oải hương',
    colors: ['#9370DB', '#BA55D3', '#8B7BA8', '#DDA0DD', '#D8BFD8'],
    defaultColor: '#9370DB',
    leafColors: ['#2F4F4F', '#556B2F', '#6B8E23'],
  },
  banyan: {
    name: 'Cây Đa',
    emoji: '🌳',
    description: 'Cây đa lâu năm',
    colors: ['#228B22', '#006400', '#355E3B', '#2F4F4F', '#1C1C1C'],
    defaultColor: '#228B22',
    leafColors: ['#32CD32', '#7CB342', '#8BC34A'],
  },
  bamboo: {
    name: 'Cây Tre',
    emoji: '🎋',
    description: 'Cây tre tươi xanh',
    colors: ['#90EE90', '#7CFC00', '#ADFF2F', '#7FFF00', '#32CD32'],
    defaultColor: '#7CFC00',
    leafColors: ['#228B22', '#3CB371', '#556B2F'],
  },
  cactus: {
    name: 'Xương Rồng',
    emoji: '🌵',
    description: 'Cây xương rồng mềm mỏng',
    colors: ['#9DC183', '#90EE90', '#8FBC8F', '#6B8E23', '#ADFF2F'],
    defaultColor: '#9DC183',
    leafColors: ['#556B2F', '#6B8E23', '#808000'],
  },
  sunflower: {
    name: 'Hoa Hướng Dương',
    emoji: '🌻',
    description: 'Hoa hướng dương tươi sáng',
    colors: ['#FFD700', '#FFA500', '#FF8C00', '#FFC700', '#FFED4E'],
    defaultColor: '#FFD700',
    leafColors: ['#228B22', '#32CD32', '#3CB371'],
  },
  orchid: {
    name: 'Phong Lan',
    emoji: '🌺',
    description: 'Hoa phong lan thanh lịch',
    colors: ['#DA70D6', '#EE82EE', '#DDA0DD', '#DB7093', '#FF1493'],
    defaultColor: '#DA70D6',
    leafColors: ['#2F4F4F', '#556B2F', '#6B8E23'],
  },
  moneyPlant: {
    name: 'Cây Kim Tiền',
    emoji: '💚',
    description: 'Cây kim tiền may mắn',
    colors: ['#228B22', '#32CD32', '#90EE90', '#3CB371', '#7CFC00'],
    defaultColor: '#228B22',
    leafColors: ['#7CB342', '#8BC34A', '#9CCC65'],
  },
  peony: {
    name: 'Hoa Mẫu Đơn',
    emoji: '🌸',
    description: 'Hoa mẫu đơn sang trọng',
    colors: ['#FFB6C1', '#FFC0CB', '#FF69B4', '#FF1493', '#DB7093'],
    defaultColor: '#FFB6C1',
    leafColors: ['#228B22', '#32CD32', '#556B2F'],
  },
  jadePlant: {
    name: 'Cây Sen Đá',
    emoji: '💎',
    description: 'Cây sen đá bền bỉ',
    colors: ['#90EE90', '#98D98E', '#7CFC00', '#ADFF2F', '#F0E68C'],
    defaultColor: '#90EE90',
    leafColors: ['#6B8E23', '#808000', '#556B2F'],
  },
  hibiscus: {
    name: 'Hoa Phỉ Thuê',
    emoji: '🌺',
    description: 'Hoa phỉ thuê rực rỡ',
    colors: ['#FF6347', '#FF4500', '#DC143C', '#FF8C00', '#FF69B4'],
    defaultColor: '#FF6347',
    leafColors: ['#228B22', '#32CD32', '#3CB371'],
  },
}

export const POT_TYPES = {
  ceramic: {
    name: 'Chậu Gốm Sứ',
    type: 'ceramic',
    description: 'Chậu gốm truyền thống',
  },
  terracotta: {
    name: 'Chậu Đất Sét',
    type: 'terracotta',
    description: 'Chậu đất sét tự nhiên',
  },
  glass: {
    name: 'Chậu Thủy Tinh',
    type: 'glass',
    description: 'Chậu thủy tinh hiện đại',
  },
  hanging: {
    name: 'Chậu Treo',
    type: 'hanging',
    description: 'Chậu treo trên không',
  },
  metallic: {
    name: 'Chậu Kim Loại',
    type: 'metallic',
    description: 'Chậu kim loại bạc sáng',
  },
  wooden: {
    name: 'Chậu Gỗ',
    type: 'wooden',
    description: 'Chậu gỗ ấm áp',
  },
  marble: {
    name: 'Chậu Đá Cẩm Thạch',
    type: 'marble',
    description: 'Chậu đá cao cấp',
  },
  minimalist: {
    name: 'Chậu Tối Giản',
    type: 'minimalist',
    description: 'Chậu thiết kế tối giản',
  },
}

export const POT_COLORS = {
  classic: [
    { name: 'Đất Sét Đỏ', value: '#CD5C5C' },
    { name: 'Nâu Tự Nhiên', value: '#8B4513' },
    { name: 'Xám Nhạt', value: '#D3D3D3' },
    { name: 'Trắng Kem', value: '#F5F5DC' },
    { name: 'Đen Matte', value: '#2F4F4F' },
  ],
  modern: [
    { name: 'Rose Gold', value: '#B76E79' },
    { name: 'Bạc Nhám', value: '#C0C0C0' },
    { name: 'Xanh Mint', value: '#98FF98' },
    { name: 'Vàng Ấm', value: '#FFD700' },
    { name: 'Đỏ Hiện Đại', value: '#E63946' },
  ],
  pastel: [
    { name: 'Hồng Nhạt', value: '#FFB6D9' },
    { name: 'Xanh Lam Nhạt', value: '#ADD8E6' },
    { name: 'Vàng Nhạt', value: '#FFFFE0' },
    { name: 'Xanh Lá Nhạt', value: '#90EE90' },
    { name: 'Tím Nhạt', value: '#E6D5FA' },
  ],
  vibrant: [
    { name: 'Cam Rực', value: '#FF6347' },
    { name: 'Lục Lam', value: '#00CED1' },
    { name: 'Tím Rực', value: '#9D00FF' },
    { name: 'Hồng Neon', value: '#FF10F0' },
    { name: 'Xanh Neon', value: '#39FF14' },
  ],
}

export const EFFECTS = [
  {
    id: 'none',
    name: 'Bình Thường',
    emoji: '😊',
    description: 'Không có hiệu ứng',
  },
  {
    id: 'glow',
    name: 'Tỏa Sáng',
    emoji: '✨',
    description: 'Tỏa sáng nhẹ nhàng',
  },
  {
    id: 'sparkle',
    name: 'Lấp Lánh',
    emoji: '💫',
    description: 'Hiệu ứng lấp lánh',
  },
  {
    id: 'shadow',
    name: 'Bóng Đổ',
    emoji: '🌑',
    description: 'Bóng đổ sâu',
  },
  {
    id: 'fog',
    name: 'Sương Mù',
    emoji: '🌫️',
    description: 'Hiệu ứng sương mù',
  },
]

export const DECORATIONS = [
  { id: 'ribbon', name: 'Nơ', emoji: '🎀' },
  { id: 'lights', name: 'Đèn', emoji: '💡' },
  { id: 'string', name: 'Dây Treo', emoji: '⛓️' },
  { id: 'butterfly', name: 'Bướm', emoji: '🦋' },
  { id: 'bird', name: 'Chim', emoji: '🐦' },
  { id: 'stone', name: 'Đá', emoji: '🪨' },
]

export const BACKGROUNDS = [
  { id: 'white', name: 'Trắng', color: '#FFFFFF' },
  { id: 'cream', name: 'Kem', color: '#F5F5DC' },
  { id: 'light-green', name: 'Xanh Nhạt', color: '#E8F5E9' },
  { id: 'light-blue', name: 'Xanh Dương Nhạt', color: '#E3F2FD' },
  { id: 'light-pink', name: 'Hồng Nhạt', color: '#FCE4EC' },
  { id: 'light-purple', name: 'Tím Nhạt', color: '#F3E5F5' },
]
