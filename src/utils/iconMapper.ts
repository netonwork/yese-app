import { 
  Play,
  Zap, 
  Heart, 
  Smile, 
  AlertTriangle, 
  Drama, 
  Rocket, 
  Ghost, 
  Sparkles, 
  Mountain, 
  Shield, 
  Eye, 
  MapPin, 
  Music, 
  FileText, 
  Palette, 
  Home, 
  BookOpen, 
  Clock3
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// 图标名称到组件的映射
const iconMap: Record<string, LucideIcon> = {
  Play,
  Zap,
  Heart,
  Smile,
  AlertTriangle,
  Drama,
  Rocket,
  Ghost,
  Sparkles,
  Mountain,
  Shield,
  Eye,
  MapPin,
  Music,
  FileText,
  Palette,
  Home,
  BookOpen,
  Clock3
}

/**
 * 根据图标名称获取对应的图标组件
 */
export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || Play // 默认返回Play图标
}

/**
 * 获取所有可用的图标名称
 */
export function getAvailableIconNames(): string[] {
  return Object.keys(iconMap)
}
